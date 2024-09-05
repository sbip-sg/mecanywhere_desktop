import Dockerode, { ContainerInfo } from 'dockerode';
import log from 'electron-log/main';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { IpcMainEvent } from 'electron';
import { ContainerPort, ImageName } from '../common/dockerNames';
import Channels from '../common/channels';
import { getIpfsFilesDir } from './ipfsIntegration';
import { getElectronStoreFromKey } from './electronStore';

const docker = new Dockerode();

const DEFAULT_EXECUTOR_GPU_CONFIG = `
type: "docker"
timeout: 1
cpu: 4
mem: 4096
has_gpu: true
`;

const rawPymecaEnvKeys: string[] = [
  'MECA_BLOCKCHAIN_RPC_URL',
  'MECA_TASK_EXECUTOR_URL',
  'MECA_IPFS_HOST',
  'MECA_IPFS_PORT',
  'MECA_HOST_PRIVATE_KEY',
  'MECA_HOST_ENCRYPTION_PRIVATE_KEY',
  'MECA_IPFS_API_HOST',
  'MECA_IPFS_API_PORT',
  'MECA_DEV_PRIVATE_KEY',
  'MECA_USER_PRIVATE_KEY',
  'MECA_TOWER_PRIVATE_KEY',
  'MECA_DAO_CONTRACT_ADDRESS',
];

// get the env details
export const getPymecaEnv = (): string[] => {
  return Object(rawPymecaEnvKeys).map((key: string) => {
    const value = getElectronStoreFromKey(key);
    if (value === null || value === undefined) {
      return `${key}=`;
    }
    return `${key}=${value}`;
  });
}

export const removeDockerContainer = async (
  event: IpcMainEvent,
  containerName: string
) => {
  docker.listContainers(
    { all: true },
    (err: Error, containers?: ContainerInfo[]) => {
      if (err) {
        console.error(err);
        event.reply(
          Channels.REMOVE_DOCKER_CONTAINER_RESPONSE,
          false,
          err.message
        );
        return;
      }

      const containerInfo = containers?.find((c) =>
        c.Names.some((name) => name.includes(containerName))
      );

      if (containerInfo) {
        const container = docker.getContainer(containerInfo.Id);

        const removeContainer = () => {
          container.remove((err: Error) => {
            if (err) {
              console.error(err);
              event.reply(
                Channels.REMOVE_DOCKER_CONTAINER_RESPONSE,
                false,
                err.message
              );
            } else {
              event.reply(Channels.REMOVE_DOCKER_CONTAINER_RESPONSE, true);
              console.log(`Container ${containerName} removed successfully.`);
            }
          });
        };

        // Check if the container is already stopped
        if (containerInfo.State === 'running') {
          container.stop((err: Error) => {
            if (err) {
              console.error(err);
              event.reply(
                Channels.REMOVE_DOCKER_CONTAINER_RESPONSE,
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
        event.reply(Channels.REMOVE_DOCKER_CONTAINER_RESPONSE, true);
      }
    }
  );
};

export const runDockerContainer = async (
  event: IpcMainEvent,
  imageName: ImageName,
  containerName: string
) => {
  try {
    docker.listContainers({ all: true }, (err, containers) => {
      if (err) throw err;

      const existingContainer = containers?.find((c) =>
        c.Names.some((name) => name.includes(containerName))
      );

      if (existingContainer) {
        // Container exists, start it if it's not running
        if (existingContainer.State !== 'running') {
          docker
            .getContainer(existingContainer.Id)
            .start((err: Error, _data) => {
              if (err) throw err;
              log.info('Existing container started');
              event.reply(Channels.RUN_DOCKER_CONTAINER_RESPONSE, true);
            });
        } else {
          log.info('Container is already running');
          event.reply(Channels.RUN_DOCKER_CONTAINER_RESPONSE, true);
        }
      } else {
        installImageIfNotExists(imageName, () => {
          // Container does not exist, create and start it
          const containerOptions: Dockerode.ContainerCreateOptions =
            getContainerCreateOptions(imageName, containerName);

          docker.createContainer(containerOptions, (err: Error, container) => {
            if (err) throw err;

            container?.start((err: Error, _data) => {
              if (err) throw err;
              log.info('New container started');
              container?.inspect((err, data) => {
                if (err) throw err;
                if (data) {
                  event.reply(Channels.RUN_DOCKER_CONTAINER_RESPONSE, true);
                }
              });
            });
          });
        });
      }
    });
  } catch (error) {
    console.log(error);
    event.reply(
      Channels.RUN_DOCKER_CONTAINER_RESPONSE,
      false,
      (error as Error).message
    );
  }
};

const installImageIfNotExists = (
  imageName: ImageName,
  callback: () => void
) => {
  docker.listImages({ all: true }, (err, images) => {
    if (err) throw err;

    const imageExists = images?.some((image) =>
      image.RepoTags?.includes(imageName)
    );

    if (!imageExists) {
      docker.pull(imageName, (err2: Error, stream) => {
        if (err2) throw err2;

        docker.modem.followProgress(stream, onFinished, onProgress);

        function onFinished(err3: Error | null, output) {
          if (err3) throw err3;
          console.log('Pull complete:', output);
          callback();
        }

        function onProgress(event) {
          console.log('Pull progress:', event);
        }
      });
    } else {
      callback();
    }
  });
};

const checkIfContainerHasGpu = (containerId: string, callback) => {
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
    console.log('Container has GPU:', hasGpu);
    callback(null, hasGpu);
  });
};

export const runExecutorGPUContainer = async (
  event: IpcMainEvent,
  containerName: string
) => {
  try {
    // Create a temporary file and write configuration data
    const tempDir = os.tmpdir();
    const configFilePath = path.join(tempDir, 'meca_docker_gpu.yaml');
    fs.writeFileSync(configFilePath, DEFAULT_EXECUTOR_GPU_CONFIG);

    const containerOptions: Dockerode.ContainerCreateOptions =
      getContainerCreateOptions(ImageName.MECA_EXECUTOR, containerName, true);
    containerOptions.HostConfig?.Binds?.push(
      `${configFilePath}:/app/mecanywhere_executor.yaml`
    );

    docker.createContainer(containerOptions, (err, container) => {
      if (err) {
        console.error(err);
        return;
      }
      container?.start((err, data) => {
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
      (error as Error).message
    );
  }
};

export const checkDockerDaemonRunning = (event: IpcMainEvent) => {
  docker.ping((err, data) => {
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

export const checkContainerExists = (
  event: IpcMainEvent,
  containerName: string
) => {
  docker.listContainers({ all: true }, (err, containers) => {
    if (err) {
      console.error('Error listing containers:', err);
      event.reply(Channels.CHECK_CONTAINER_EXIST_RESPONSE, false, err.message);
      return;
    }

    const containerExists = containers?.some((container) =>
      container.Names.some((name) => name.includes(containerName))
    );
    console.log(`Container ${containerName} exists: ${containerExists}`);
    event.reply(Channels.CHECK_CONTAINER_EXIST_RESPONSE, true, containerExists);
  });
};

export const checkContainerGPUSupport = (
  event: IpcMainEvent,
  containerName: string
) => {
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

    const containerInfo = containers?.find((c) =>
      c.Names.some((name) => name.includes(containerName))
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

export const buildImage = (
  event: IpcMainEvent,
  tag: string,
  dockerfilePath: string
) => {
  docker.buildImage(
    {
      context: `${getIpfsFilesDir}/${dockerfilePath}`,
      src: ['Dockerfile', 'src/'],
    },
    {
      t: tag,
    },
    (err, stream) => {
      if (err) {
        console.error(err);
        event.reply(Channels.BUILD_IMAGE_RESPONSE, false, err.message);
        return;
      }

      docker.modem.followProgress(stream, onFinished, onProgress);

      function onFinished(err, output) {
        if (err) {
          console.error(err);
          event.reply(Channels.BUILD_IMAGE_RESPONSE, false, err.message);
          return;
        }

        console.log('Build complete:', output);
        event.reply(Channels.BUILD_IMAGE_RESPONSE, true);
      }

      function onProgress(event) {
        console.log('Build progress:', event);
      }
    }
  );
};

function getContainerCreateOptions(
  imageName: ImageName,
  containerName: string,
  hasGpu: boolean = false
): Dockerode.ContainerCreateOptions {
  let containerOptions: Dockerode.ContainerCreateOptions;
  switch (imageName) {
    case ImageName.MECA_EXECUTOR: {
      const port =
        getElectronStoreFromKey("MECA_EXECUTOR_PORT") || ContainerPort.MECA_EXECUTOR_1_PORT;
      containerOptions = {
        name: containerName,
        Image: imageName,
        ExposedPorts: { [`${port}/tcp`]: {} },
        HostConfig: {
          Binds: ['/var/run/docker.sock:/var/run/docker.sock'],
          PortBindings: { [`${port}/tcp`]: [{ HostPort: port }] },
          NetworkMode: 'meca',
        },
      };
      break;
    }
    case ImageName.PYMECA_SERVER: {
      const port =
        getElectronStoreFromKey("PYMECA_SERVER_PORT") || ContainerPort.PYMECA_SERVER_1_PORT;
      containerOptions = {
        name: containerName,
        Image: imageName,
        ExposedPorts: { [`${port}/tcp`]: {} },
        HostConfig: {
          PortBindings: { [`${port}/tcp`]: [{ HostPort: port }] },
        },
        Cmd: ['server.py', port],
        Env: getPymecaEnv(),
      };
      break;
    }
    default:
      containerOptions = {
        name: containerName,
        Image: imageName,
      };
  }
  if (hasGpu) {
    containerOptions.HostConfig = {
      ...containerOptions.HostConfig,
      DeviceRequests: [
        {
          Driver: '',
          Count: -1, // -1 specifies "all GPUs"
          DeviceIDs: [],
          Capabilities: [['gpu']],
          Options: {},
        },
      ],
    };
  }
  return containerOptions;
}

export const stopDockerContainer = (
  event: IpcMainEvent,
  containerName: string
) => {
  docker.listContainers({ all: true }, (err, containers) => {
    if (err) {
      console.error('Error listing containers:', err);
      event.reply(Channels.STOP_DOCKER_CONTAINER_RESPONSE, false, err.message);
      return;
    }

    const containerInfo = containers?.find((c) =>
      c.Names.some((name) => name.includes(containerName))
    );
    if (containerInfo) {
      const container = docker.getContainer(containerInfo.Id);
      container.stop((err) => {
        if (err) {
          console.error(err);
          event.reply(
            Channels.STOP_DOCKER_CONTAINER_RESPONSE,
            false,
            err.message
          );
        } else {
          console.log(`Container ${containerName} stopped.`);
          event.reply(Channels.STOP_DOCKER_CONTAINER_RESPONSE, true);
        }
      });
    }
  });
};
