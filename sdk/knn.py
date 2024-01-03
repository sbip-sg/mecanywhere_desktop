import asyncio
import json
from py import meca_api
import torch
from dotenv import load_dotenv

def euclidean_distance(a, b):
    return torch.sqrt(torch.sum((a - b) ** 2))

def find_k_nearest_neighbors(input_data, dataset_chunk, k):
    distances = [(index, euclidean_distance(input_data, data_point)) for index, data_point in enumerate(dataset_chunk)]
    distances.sort(key=lambda x: x[1])
    return [index for index, _ in distances[:k]]

def process_data_chunk(input_data, dataset_chunk, k, chunk_start_index, result_queue):
    neighbors = find_k_nearest_neighbors(input_data, dataset_chunk, k)
    adjusted_neighbors = [index + chunk_start_index for index in neighbors]
    result_queue.put(adjusted_neighbors)

async def distributed_knn(input_data, dataset, k, num_processes):
    num_data_points = len(dataset)
    chunk_size = num_data_points // num_processes

    # ==================== MECA OFFLOAD API ====================

    result_list = []

    def callback_on_receive(task_id, status, response, err, corr_id):
        print("Received in test:", task_id, status, response, err, corr_id)
        if status == 0:
          print(err, "for task: ", task_id, "corr_id:", corr_id)
        try:
          result = json.loads(response)
        except:
          print("Error parsing response:", response)
          return
        result_list.extend(result)

    try:
      await meca_api.initiate_connection()
    except Exception as e:
      await meca_api.disconnect()
      raise SystemExit()

    for i in range(num_processes):
        start_index = i * chunk_size
        end_index = (i + 1) * chunk_size if i < num_processes - 1 else num_data_points
        sliced_dataset = dataset[start_index:end_index].clone().detach()

        await meca_api.offload_task(
          task_id=str(i),
          container_ref='jyume/meca:0.0.6',
          data=json.dumps({
            "dataset": sliced_dataset.tolist(),
            "point": input_data.tolist(),
            "k": k,
            "num_processes": num_processes
          }),
          resource={
             "cpu": 1,
             "memory": 256
          },
          callback=callback_on_receive)

    await meca_api.join(task_timeout=30, join_timeout=30)

    # ====================  ====================

    distances = [(index, euclidean_distance(input_data, dataset[index])) for index in result_list]
    distances.sort(key=lambda x: x[1])
    overall_neighbors = [index for index, _ in distances[:k]]

    return overall_neighbors

# Example usage:
async def main():
    load_dotenv()

    dataset = torch.Tensor([
        [1, 2],
        [3, 4],
        [5, 6],
        [7, 8],
        [9, 10]
    ])

    # Example input data point
    input_data = torch.Tensor([2, 3])
    k = 2
    num_processes = 1

    print("Number of processes:", num_processes)
    print("Number of nearest neighbors:", k)

    neighbors = await distributed_knn(input_data, dataset, k, num_processes)

    print("Nearest neighbors indices:", neighbors)
    print("Nearest neighbors data points:", dataset[neighbors])
    await meca_api.disconnect()

if __name__ == '__main__':
    try:
      asyncio.run(main())
    except KeyboardInterrupt:
      print("Program closed by user.")
      asyncio.run(meca_api.disconnect())
