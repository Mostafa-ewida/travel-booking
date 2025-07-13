# Travel Booking System

## Setup
if you want to use docker compose to install it 
```bash
docker-compose up  -d
```

if you want to use helm and k8s to install it 
make sure you have the kubeconfig configured and kubectl installed 

### With create a namespace  named mostafa you can change it here and in the cert.sh too if you need to

```bash
kubectl create namespace mostafa \
kubectl config set-context --current --namespace=mostafa \
```

### install rook-ceph
make sure before installing to change the name of the dev you are using the name here is set to xvdd and make sure you have a raw device that is not partitioned and formated {does not have a filesystem installed)  
you can use lsblk on the worker nodes to check
#### here is a deployment guide-blog  [medium.com](https://faun.pub/deploy-rook-ceph-on-kubernetes-3a2252f3732e)
```bash 
lsblk
```



```bash

kubectl apply -f k8s/rook-ceph/crd.yaml k8s/rook-ceph/common.yaml  k8s/rook-ceph/operator.yaml \
sleep 30 \
kubectl apply -f k8s/rook-ceph/cluster.yaml \
sleep 300 \
kubectl apply -f k8s/rook-ceph/toolbox.yaml \ 
kubectl apply -f k8s/rook-ceph/filesystem.yaml \
kubectl apply -f k8s/rook-ceph/storageclass.yaml \

```

## install self-signed cert in namespaces default , rook-ceph and mostafa
```bash
chmod +x k8s/ingress/cert.sh \
./k8s/ingress/cert.sh 
```

### install helm 3rd party apps 

```bash

chmod +x helm/install.sh \
./helm/install.sh 
```
### use opbeans app to integrate an apm service  

```bash
kubectl apply -f k8s/opbeans/deployment.yaml
```


### install ingress must have nginx ingress installed 

```bash
kubectl apply -f k8s/ingress 2>/dev/null \
kubectl apply -f k8s/rook-ceph/ceph-ingress.yaml 

```