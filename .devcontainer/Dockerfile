FROM mcr.microsoft.com/devcontainers/base:ubuntu-22.04

ENV HOME=/home/vscode

# Install dependencies
RUN sudo apt-get update
RUN curl -sS https://starship.rs/install.sh | sh -s -- --yes
RUN echo 'eval "$(starship init bash)"' >> $HOME/.bashrc
