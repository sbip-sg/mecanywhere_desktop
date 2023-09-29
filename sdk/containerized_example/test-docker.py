import json
import torch
import multiprocessing
from flask import Flask, request

app = Flask(__name__)

@app.route('/', methods=['POST'])
def entry_point():
    input = request.json

    dataset = torch.Tensor(input.get('dataset'))
    point = torch.Tensor(input.get('point'))
    k = input.get('k')
    num_processes = input.get('num_processes')

    print("Number of processes:", num_processes)
    print("Number of nearest neighbors:", k)

    neighbors = distributed_knn(point, dataset, k, num_processes)

    print("Nearest neighbors indices:", neighbors)
    print("Nearest neighbors data points:", dataset[neighbors])

    return json.dumps(neighbors)


def euclidean_distance(a, b):
    return torch.sqrt(torch.sum((a - b) ** 2))

def find_k_nearest_neighbors(point, dataset_chunk, k):
    distances = [(index, euclidean_distance(point, data_point)) for index, data_point in enumerate(dataset_chunk)]
    distances.sort(key=lambda x: x[1])
    return [index for index, _ in distances[:k]]

def process_data_chunk(point, dataset_chunk, k, chunk_start_index, result_queue):
    neighbors = find_k_nearest_neighbors(point, dataset_chunk, k)
    adjusted_neighbors = [index + chunk_start_index for index in neighbors]
    result_queue.put(adjusted_neighbors)

def distributed_knn(point, dataset, k, num_processes):
    num_data_points = len(dataset)
    chunk_size = num_data_points // num_processes

    manager = multiprocessing.Manager()
    result_queue = manager.Queue()

    processes = []
    for i in range(num_processes):
        start_index = i * chunk_size
        end_index = (i + 1) * chunk_size if i < num_processes - 1 else num_data_points
        sliced_dataset = dataset[start_index:end_index].clone().detach()
        process = multiprocessing.Process(target=process_data_chunk, args=(point, sliced_dataset, k, start_index, result_queue))
        processes.append(process)

    for process in processes:
        process.start()

    for process in processes:
        process.join()

    neighbors_list = []
    while not result_queue.empty():
        neighbors_list.extend(result_queue.get())

    distances = [(index, euclidean_distance(point, dataset[index])) for index in neighbors_list]
    distances.sort(key=lambda x: x[1])
    overall_neighbors = [index for index, _ in distances[:k]]

    return overall_neighbors

print("meca-init-done")
