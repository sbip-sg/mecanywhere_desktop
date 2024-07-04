FROM ubuntu:20.04 as sgx_dcap_2.14_1.11

USER root

# avoid tzdata interactive config during apt install.
ENV TZ=Asia/Singapore
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update && apt-get install -y \
  build-essential \
  git \
  wget

# install sdk
RUN wget https://download.01.org/intel-sgx/sgx-dcap/1.11/linux/distro/ubuntu20.04-server/sgx_linux_x64_sdk_2.14.100.2.bin \
  && chmod 755 sgx_linux_x64_sdk_2.14.100.2.bin \
  && ./sgx_linux_x64_sdk_2.14.100.2.bin --prefix=/opt/intel \
  source /opt/intel/sgxsdk/environment

# install dcap libs
RUN echo 'deb [arch=amd64] https://download.01.org/intel-sgx/sgx_repo/ubuntu focal main' | tee /etc/apt/sources.list.d/intel-sgx.list > /dev/null \
  && wget -O - https://download.01.org/intel-sgx/sgx_repo/ubuntu/intel-sgx-deb.key | apt-key add - \
  && apt update

RUN apt install -y \
  libsgx-epid=2.14.100.2-focal1 \
  libsgx-headers=2.14.100.2-focal1 \
  libsgx-urts=2.14.100.2-focal1 \
  libsgx-launch=2.14.100.2-focal1 \
  libsgx-ae-le=2.14.100.2-focal1 \
  libsgx-ae-pce=2.14.100.2-focal1 \
  libsgx-ae-qe3=1.11.100.2-focal1 \
  libsgx-ae-qve=1.11.100.2-focal1 \
  libsgx-ae-epid=2.14.100.2-focal1 \
  libsgx-qe3-logic=1.11.100.2-focal1 \
  libsgx-pce-logic=1.11.100.2-focal1 \
  libsgx-enclave-common=2.14.100.2-focal1 \
  sgx-aesm-service=2.14.100.2-focal1 \
  libsgx-quote-ex=2.14.100.2-focal1 \
  libsgx-dcap-ql=1.11.100.2-focal1 \
  libsgx-dcap-quote-verify=1.11.100.2-focal1 \
  # workload system additional packages
  libsgx-quote-ex-dev=2.14.100.2-focal1 \
  libsgx-dcap-ql-dev=1.11.100.2-focal1 \
  libsgx-dcap-quote-verify-dev=1.11.100.2-focal1 \
  # qpl needed for verification
  libsgx-dcap-default-qpl=1.11.100.2-focal1 \
  # runtime
  libsgx-uae-service=2.14.100.2-focal1

# install sgx-sdk mitigation tools (necessary to build sgxssl)
RUN apt-get install -y \
  build-essential \
  ocaml \
  ocamlbuild \
  automake \
  autoconf \
  libtool \
  wget \
  python-is-python3 \
  libssl-dev \
  git \
  cmake \
  perl \
  libssl-dev \
  libcurl4-openssl-dev \
  protobuf-compiler \
  libprotobuf-dev \
  debhelper \
  reprepro \
  unzip \
  && cd / && git clone https://github.com/intel/linux-sgx.git && cd linux-sgx && git checkout sgx_2.14 && make preparation

RUN ls /linux-sgx/external/toolset/ubuntu20.04/ && cp /linux-sgx/external/toolset/ubuntu20.04/* /usr/local/bin && cd / && ls /usr/local/bin

# install sgxssl
RUN wget https://github.com/intel/intel-sgx-ssl/archive/refs/tags/lin_2.14_1.1.1k.tar.gz \
  && tar -xzvf lin_2.14_1.1.1k.tar.gz \
  && cd intel-sgx-ssl-lin_2.14_1.1.1k/openssl_source \
  && wget https://www.openssl.org/source/openssl-1.1.1w.tar.gz \
  && cd ../Linux && make all && make install && cd ../

# should remove the sources
RUN rm -rf /linux-sgx && rm -rf /lin_2.14_1.1.1k.tar.gz /intel-sgx-ssl-lin_2.14_1.1.1k

# image size: 1.94GB

FROM sgx_dcap_2.14_1.11 as server_builder

USER root

ENV SGX_SDK=/opt/intel/sgxsdk

# avoid tzdata interactive config during apt install.
ENV TZ=Asia/Singapore
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update && apt-get install -y \
  # install deps (libuv)
  cmake \
  clang

# # without -i the bash will not load .bashrc. With -i docker complains but we can ignore it.
# SHELL ["/bin/bash", "--login", "-i", "-c"]
# ENV NODE_VERSION=16.15.0
# ENV NVM_DIR /tmp/nvm
# WORKDIR $NVM_DIR
# RUN wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash \
#   && . $NVM_DIR/nvm.sh \
#   && nvm install $NODE_VERSION \
#   && nvm alias default $NODE_VERSION \
#   && nvm use default
# ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
# ENV PATH      $NVM_DIR/v$NODE_VERSION/bin:$PATH

# a cleaner version of the above
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION v16.15.0
RUN mkdir -p /usr/local/nvm
RUN wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
RUN /bin/bash -c "source $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm use --delete-prefix $NODE_VERSION"
ENV NODE_PATH $NVM_DIR/versions/node/$NODE_VERSION/bin
ENV PATH $NODE_PATH:$PATH

RUN node --version && npm --version

COPY ./src /sgx-task
RUN cd /sgx-task/ && make mrproper && make deps \
  && cd worker && make mrproper && make all && make install && cd ..\
  && cd server && make mrproper && make all && make install && cd ..

# image
FROM sgx_dcap_2.14_1.11

USER root

# # default libuv thread pool size to 8.
# ARG UV_THREADPOOL_SIZE=8
# RUN echo UV_THREADPOOL_SIZE=${UV_THREADPOOL_SIZE}
# ENV UV_THREADPOOL_SIZE ${UV_THREADPOOL_SIZE}
# sequential request execution
ENV UV_THREADPOOL_SIZE 1

COPY --from=server_builder /sgx-task/server/install /install

EXPOSE 8080

CMD SGX_AESM_ADDR=1 /install/bin/server /install/lib/Worker_Enclave.signed.so
