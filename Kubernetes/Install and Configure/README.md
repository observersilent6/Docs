# How to Install Kubernetes on Ubuntu 22.04 | Step-by-Step


Ref : https://www.cherryservers.com/blog/install-kubernetes-on-ubuntu

https://komodor.com/learn/how-to-fix-kubernetes-node-not-ready-error/

https://www.youtube.com/watch?v=lede7TJk1PE

**Login as non-root user**



## Step 1: Disable swap


-> All Nodes


    sudo swapoff -a

    sudo sed -i '/ swap / s/^/#/' /etc/fstab

    swapon --show

## Set up hostnames

-> All Nodes (hostname should be individual on each node)

    sudo hostnamectl set-hostname "k8s-worker"

    hostname

    exec bash

## Step 3: Update the /etc/hosts File for Hostname Resolution


-> All Nodes (IP Address and hostname should be individual on each node)

    sudo nano /etc/hosts

    192.168.14.156 k8s-worker

    ping -c 4 k8s-worker


## Step 4: Set up the IPV4 bridge on all nodes


-> All Nodes

cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF


    (Press Enter)


    sudo modprobe overlay

    sudo modprobe br_netfilter


cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF



    (Press Enter)



    sudo sysctl --system


##  Step 5: Install kubelet, kubeadm, and kubectl on each node

- All Nodes
    
    sudo apt update 
    
    sudo apt install curl ca-certificates apt-transport-https

    curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-archive-keyring.gpg

    echo "deb [signed-by=/etc/apt/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list

    sudo apt update

    sudo apt install -y kubelet=1.26.5-00 kubeadm=1.26.5-00 kubectl=1.26.5-00


##  Step 6: Install Docker

- All Nodes

    sudo apt install docker.io

    sudo usermod -aG docker openvpn
    
    sudo systemctl restart docker
    
    sudo systemctl enable docker.service

    sudo mkdir /etc/containerd

    sudo sh -c "containerd config default > /etc/containerd/config.toml"

    sudo sed -i 's/ SystemdCgroup = false/ SystemdCgroup = true/' /etc/containerd/config.toml


    sudo systemctl restart containerd.service

    sudo systemctl restart kubelet.service

    sudo systemctl enable kubelet.service


##  Step 7: Initialize the Kubernetes cluster on the master node


-> Master Node

    sudo kubeadm config images pull

    sudo kubeadm init --pod-network-cidr=10.10.0.0/16


    output : 

    ```
    Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 192.168.14.155:6443 --token vdnsny.f0w49g29swc96sii \
        --discovery-token-ca-cert-hash sha256:af0679916facf60a09ccfc0bb5eb358d1465b4ac42b58ca5f0841b7770d03a36
    
    ```

    mkdir -p $HOME/.kube

    sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config

    sudo chown $(id -u):$(id -g) $HOME/.kube/config


## Step 8: Configure kubectl and Calico

-> Master Node


    kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.26.1/manifests/tigera-operator.yaml


    curl https://raw.githubusercontent.com/projectcalico/calico/v3.26.1/manifests/custom-resources.yaml -O


    sed -i 's/cidr: 192\.168\.0\.0\/16/cidr: 10.10.0.0\/16/g' custom-resources.yaml

    kubectl create -f custom-resources.yaml

##  Step 9: Add worker nodes to the cluster

-> Worker Node



sudo kubeadm join 192.168.14.155:6443 --token vdnsny.f0w49g29swc96sii \
--discovery-token-ca-cert-hash sha256:af0679916facf60a09ccfc0bb5eb358d1465b4ac42b58ca5f0841b7770d03a36


##  Step 10: Verify the cluster and test


-> Master Node

    kubectl get no

    kubectl get po -A



## Configure Kubernetes Dashboard

ref : https://adamtheautomator.com/kubernetes-dashboard/

https://dev.to/perber/how-to-create-a-secret-for-a-service-account-in-kubernetes-124-and-above-5c92

https://stackoverflow.com/questions/52322840/how-to-delete-a-service-account-in-kubernetes

https://k8s-master:32422/#/login

kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml

kubectl get all -n kubernetes-dashboard


kubectl get svc --all-namespaces


kubectl delete pod kubernetes-dashboard-6c7ccbcf87-twfsh -n kubernetes-dashboard

-   Remove a service account


    kubectl delete serviceaccount dashboard -n kubernetes-dashboard



-   Get Token

    


    kubectl create clusterrolebinding dashboard-admin -n kubernetes-dashboard  --clusterrole=cluster-admin  --serviceaccount=default:dashboard

    kubectl create sa dashboard
    kubectl create token dashboard --duration=999999h