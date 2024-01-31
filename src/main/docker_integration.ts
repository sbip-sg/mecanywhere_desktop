import { ipcMain } from 'electron';
import Channels from '../common/channels';
import log from 'electron-log/main';

const fs = require('fs');
const os = require('os');
const Docker = require('dockerode');
const docker = new Docker();

export const removeExecutorContainer = async (event, containerName) => {
  docker.listContainers({ all: true }, (err, containers) => {
    if (err) {
      console.error(err);
      event.reply(
        Channels.REMOVE_EXECUTOR_CONTAINER_RESPONSE,
        false,
        err.message
      );
      return;
    }

    const containerInfo = containers.find((c) =>
      c.Names.some((n) => n === `/${containerName}`)
    );

    if (containerInfo) {
      const container = docker.getContainer(containerInfo.Id);

      const removeContainer = () => {
        container.remove((err) => {
          if (err) {
            console.error(err);
            event.reply(
              Channels.REMOVE_EXECUTOR_CONTAINER_RESPONSE,
              false,
              err.message
            );
          } else {
            event.reply(Channels.REMOVE_EXECUTOR_CONTAINER_RESPONSE, true);
            console.log(`Container ${containerName} removed successfully.`);
          }
        });
      };

      // Check if the container is already stopped
      if (containerInfo.State === 'running') {
        container.stop((err) => {
          if (err) {
            console.error(err);
            event.reply(
              Channels.REMOVE_EXECUTOR_CONTAINER_RESPONSE,
              false,
              err.message
            );
            return;
          }
          removeContainer();
        });
      } else {
        removeContainer();
      }
    } else {
      console.log(`Container ${containerName} not found.`);
      event.reply(Channels.REMOVE_EXECUTOR_CONTAINER_RESPONSE, true);
    }
  });
};

export const runExecutorContainer = async (event, containerName) => {
  try {
    docker.listContainers({ all: true }, (err, containers) => {
      if (err) {
        console.error(err);
        return;
      }

      const existingContainer = containers.find((c) =>
        c.Names.includes('/' + containerName)
      );

      if (existingContainer) {
        // Container exists, start it if it's not running
        if (existingContainer.State !== 'running') {
          docker.getContainer(existingContainer.Id).start((err, data) => {
            if (err) {
              console.error(err);
            } else {
              log.info('Existing container started');
              event.reply(Channels.RUN_EXECUTOR_CONTAINER_RESPONSE, true);
            }
          });
        } else {
          log.info('Container is already running');
          event.reply(Channels.RUN_EXECUTOR_CONTAINER_RESPONSE, true);
        }
      } else {
        // Container does not exist, create and start it
        const containerOptions = {
          name: containerName,
          Image: 'meca-executor:latest',
          ExposedPorts: { '2591/tcp': {} },
          HostConfig: {
            Binds: ['/var/run/docker.sock:/var/run/docker.sock'],
            PortBindings: { '2591/tcp': [{ HostPort: '2591' }] },
            NetworkMode: 'meca',
          },
          NetworkingConfig: {
            EndpointsConfig: {
              meca: {
                IPAMConfig: {
                  IPv4Address: process.env.IPV4_ADDRESS,
                },
              },
            },
          },
        };

        docker.createContainer(containerOptions, (err, container) => {
          if (err) {
            console.error(err);
            return;
          }

          container.start((err, data) => {
            if (err) {
              console.error(err);
            } else {
              log.info('New container started');
              event.reply(Channels.RUN_EXECUTOR_CONTAINER_RESPONSE, true);
            }
          });
        });
      }
    });
  } catch (error) {
    event.reply(Channels.RUN_EXECUTOR_CONTAINER_RESPONSE, false, error.message);
  }
};

const checkIfContainerHasGpu = (containerId, callback) => {
  const container = docker.getContainer(containerId);
  container.inspect((err, data) => {
    if (err) {
      callback(err, false);
      return;
    }
    const hasGpu =
      data.HostConfig.DeviceRequests?.some((deviceRequest) =>
        deviceRequest.Capabilities?.some((capability) =>
          capability.includes('gpu')
        )
      ) || false;
    callback(null, hasGpu);
  });
};

export const runExecutorGPUContainer = async (event, containerName) => {
  try {
    // Configuration data
    const configData = `
  type: "docker"
  timeout: 1
  cpu: 4
  mem: 4096
  has_gpu: true
  `;

    // Create a temporary file and write configuration data
    const tempDir = os.tmpdir();
    const configFilePath = path.join(tempDir, 'meca_docker_gpu.yaml');
    fs.writeFileSync(configFilePath, configData);

    const containerOptions = {
      name: containerName,
      Image: 'meca-executor:latest',
      ExposedPorts: { '2591/tcp': {} },
      HostConfig: {
        Binds: [
          '/var/run/docker.sock:/var/run/docker.sock',
          `${configFilePath}:/app/meca_executor.yaml`,
        ],
        PortBindings: { '2591/tcp': [{ HostPort: '2591' }] },
        NetworkMode: 'meca',
        DeviceRequests: [
          {
            Driver: '',
            Count: -1, // -1 specifies "all GPUs"
            DeviceIDs: [],
            Capabilities: [['gpu']],
            Options: {},
          },
        ],
      },
      NetworkingConfig: {
        EndpointsConfig: {
          meca: {
            IPAMConfig: {
              IPv4Address: process.env.IPV4_ADDRESS,
            },
          },
        },
      },
    };
    docker.createContainer(containerOptions, (err, container) => {
      if (err) {
        console.error(err);
        return;
      }
      container.start((err, data) => {
        if (err) {
          event.reply(
            Channels.RUN_EXECUTOR_GPU_CONTAINER_RESPONSE,
            false,
            err.message
          );
          console.error(err);
        } else {
          log.info('New container started');
          event.reply(Channels.RUN_EXECUTOR_GPU_CONTAINER_RESPONSE, true);
        }
      });
    });
  } catch (error) {
    console.error(error);
    event.reply(
      Channels.RUN_EXECUTOR_GPU_CONTAINER_RESPONSE,
      false,
      error.message
    );
  }
};

export const checkDockerDaemonRunning1 = (event) => {
  console.log('daemonnnn');
  log.info('daemonnnn');
  docker.ping((err, data) => {
    console.log('daemonnnn2');
    log.info('daemonnnn2');

    if (err) {
      console.error('Docker daemon is not running', err);
      event.reply(
        Channels.CHECK_DOCKER_DAEMON_RUNNING_RESPONSE,
        false,
        err.message
      );
    } else {
      console.log('Docker daemon is running', data);
      event.reply(Channels.CHECK_DOCKER_DAEMON_RUNNING_RESPONSE, true, true);
    }
  });
};

export const checkContainerExists = (event, containerName) => {
  docker.listContainers({ all: true }, (err, containers) => {
    if (err) {
      console.error('Error listing containers:', err);
      event.reply(Channels.CHECK_CONTAINER_EXIST_RESPONSE, false, err.message);
      return;
    }

    const containerExists = containers.some((container) =>
      container.Names.some((name) => name === `/${containerName}`)
    );

    event.reply(Channels.CHECK_CONTAINER_EXIST_RESPONSE, true, containerExists);
  });
};

export const checkContainerGPUSupport = (event, containerName) => {
  docker.listContainers({ all: true }, (err, containers) => {
    if (err) {
      console.error('Error listing containers:', err);
      event.reply(
        Channels.CHECK_CONTAINER_GPU_SUPPORT_RESPONSE,
        false,
        err.message
      );
      return;
    }

    const containerInfo = containers.find((c) =>
      c.Names.includes('/' + containerName)
    );

    if (containerInfo) {
      checkIfContainerHasGpu(containerInfo.Id, (error, hasGpu: boolean) => {
        if (error) {
          console.error('Error inspecting container:', error);
          event.reply(
            Channels.CHECK_CONTAINER_GPU_SUPPORT_RESPONSE,
            false,
            error.message
          );
        } else {
          event.reply(
            Channels.CHECK_CONTAINER_GPU_SUPPORT_RESPONSE,
            true,
            hasGpu
          );
        }
      });
    } else {
      console.log(`Container ${containerName} not found.`);
      event.reply(Channels.CHECK_CONTAINER_GPU_SUPPORT_RESPONSE, true, false);
    }
  });
};

// Register IPC handlers
export const registerDockerIpcHandlers = () => {
  ipcMain.on('REMOVE_EXECUTOR_CONTAINER', removeExecutorContainer);
  ipcMain.on('RUN_EXECUTOR_CONTAINER', runExecutorContainer);
  ipcMain.on('RUN_EXECUTOR_GPU_CONTAINER', runExecutorGPUContainer);
//   ipcMain.on('CHECK_DOCKER_DAEMON_RUNNING', checkDockerDaemonRunning1);
  ipcMain.on('CHECK_CONTAINER_EXIST', checkContainerExists);
  ipcMain.on('CHECK_CONTAINER_GPU_SUPPORT', checkContainerGPUSupport);
};
