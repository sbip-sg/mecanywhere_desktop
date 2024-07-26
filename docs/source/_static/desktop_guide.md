# User Guide

## Table of Contents
1. [Introduction](#Introduction)
2. [Installation](#Installation)
3. [Usage](#Usage)

## Introduction
MEC Anywhere Desktop is an interactive application that allows you to join the MEC Anywhere ecosystem and start hosting your compute resources straight away. The application makes it easy and intuitive to manage your resources and monitor your transactions. It is designed to be user-friendly and accessible to most operating systems, including Windows, MacOS, and Linux.

## Installation
Download the latest version of the application from the [MEC Anywhere Desktop GitHub repository](https://github.com/sbip-sg/meca_desktop/releases).

You will also need to have Docker installed on your machine. You can download Docker from the [official Docker website](https://www.docker.com/get-started).

Set the environment variables by creating a `.env.pymeca` file by filling in `.env.pymeca.example` with the necessary information. `.env` can be edited to change the default values of the environment variables.

## Usage
To start the application, simply run the executable file that you downloaded. 

### Dashboard and resource sharing
![Dashboard](/_static/images/dashboard.png)
Here you can see an overview of your resources and transactions. 

On the top left, you can customize the resources to share and enable it to be connected to the MEC Anywhere ecosystem. This allows you to receive tasks from the MEC Anywhere network and earn rewards. Tasks will automatically execute on your machine. You will have to activate chosen tasks in the Tasks Management section and also register for a tower in the Tower Management section before you can receive any task.

### Tasks Management
![Tasks](/_static/images/tasks.png)
You can view the tasks that are available for downloading and activating. After downloading, it has to be built and tested before it can be activated. Once activated, other users will be able to send those specific tasks to your machine.

### Tower Management
![Towers](/_static/images/towers.png)
You can view the towers that are available for registration. You can register for a tower which will relay tasks from other users to your machine.
