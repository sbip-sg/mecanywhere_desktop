import asyncio
import torch
import multiprocessing

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

def distributed_knn(input_data, dataset, k, num_processes):
    num_data_points = len(dataset)
    chunk_size = num_data_points // num_processes

    # ==================== MULTI-PROCESSING ====================

    manager = multiprocessing.Manager()
    result_queue = manager.Queue()

    processes = []
    for i in range(num_processes):
        start_index = i * chunk_size
        end_index = (i + 1) * chunk_size if i < num_processes - 1 else num_data_points
        sliced_dataset = dataset[start_index:end_index].clone().detach()
        process = multiprocessing.Process(
            target=process_data_chunk,
            args=(input_data, sliced_dataset, k, start_index, result_queue))
        processes.append(process)

    for process in processes:
        process.start()

    for process in processes:
        process.join()

    # ====================  ====================

    neighbors_list = []
    while not result_queue.empty():
        neighbors_list.extend(result_queue.get())

    distances = [(index, euclidean_distance(input_data, dataset[index])) for index in neighbors_list]
    distances.sort(key=lambda x: x[1])
    overall_neighbors = [index for index, _ in distances[:k]]

    return overall_neighbors

# Example usage:
async def main():
    # torch.manual_seed(42)
    # dataset = torch.rand(100, 2)

    # # Example input data point
    # input_data = torch.Tensor([0.5, 0.5])

    # k = 5
    # num_processes = 4

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
    num_processes = 2

    print("Number of processes:", num_processes)
    print("Number of nearest neighbors:", k)

    neighbors = distributed_knn(input_data, dataset, k, num_processes)

    print("Nearest neighbors indices:", neighbors)
    print("Nearest neighbors data points:", dataset[neighbors])

if __name__ == '__main__':
    try:
      asyncio.run(main())
    except KeyboardInterrupt:
      print("Program closed by user.")
