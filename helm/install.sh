#!/bin/bash

# Add required Helm repos (idempotent)
helm repo add elastic https://helm.elastic.co >/dev/null 2>&1
helm repo add bitnami https://charts.bitnami.com/bitnami >/dev/null 2>&1
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts >/dev/null 2>&1
helm repo add codecentric https://codecentric.github.io/helm-charts >/dev/null 2>&1
helm repo add minio https://charts.min.io/ >/dev/null 2>&1
helm repo add mongodb https://mongodb.github.io/helm-charts >/dev/null 2>&1
helm repo update >/dev/null

# Get current namespace from kubeconfig
CURRENT_NS=$(kubectl config view --minify --output 'jsonpath={..namespace}')
echo "Installing all components in current namespace: $CURRENT_NS"

# Install all charts using local values.yaml files
helm upgrade --install apm-server elastic/apm-server -f ./apm-server/values.yaml
helm upgrade --install elasticsearch elastic/elasticsearch -f ./elasticsearch/values.yaml
helm upgrade --install kibana elastic/kibana -f ./kibana/values.yaml
helm upgrade --install keycloak codecentric/keycloak -f ./keycloak/values.yaml
helm upgrade --install prometheus-stack prometheus-community/kube-prometheus-stack -f ./kube-prometheus-stack/values.yaml
helm upgrade --install minio minio/minio -f ./minio/values.yaml
helm upgrade --install mongodb mongodb/mongodb -f ./mongodb/values.yaml
helm upgrade --install monstache bitnami/monstache -f ./monstache/values.yaml
helm upgrade --install rabbitmq bitnami/rabbitmq -f ./rabbitmq/values.yaml
helm upgrade --install redis bitnami/redis -f ./redis/values.yaml

# Verify
echo "Installations completed. Pod status:"
kubectl get pods
