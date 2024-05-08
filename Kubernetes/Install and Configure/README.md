# How to Install Kubernetes on Ubuntu 22.04 | Step-by-Step


Ref : https://www.cherryservers.com/blog/install-kubernetes-on-ubuntu
Ref - 2 : https://phoenixnap.com/kb/install-kubernetes-on-ubuntu
Ref - 3 : https://www.youtube.com/watch?v=iwlNCePWiw4

VI editor : https://www.redhat.com/sysadmin/introduction-vi-editor

https://komodor.com/learn/how-to-fix-kubernetes-node-not-ready-error/

https://www.youtube.com/watch?v=lede7TJk1PE

**Pre-requisites**

    Kubernetes requires a CRI-compliant container engine runtime such as Docker, containerd, or CRI-O. 



-   Kubernetes using Docker, do we need docker CRI on all nodes including Kubernetes Master Node?

    https://stackoverflow.com/questions/50917560/kubernetes-using-docker-do-we-need-docker-cri-on-all-nodes-including-kubernetes

**In-case of any error *related to source list**
cd /etc/apt/sources.list.d

in case of error

sudo rm /var/lib/apt/lists/lock
sudo rm /var/cache/apt/archives/lock
sudo rm /var/lib/dpkg/lock*

sudo dpkg --configure -a

sudo apt update



**Login as non-root user : user with user privileges** 




## Step 1: Disable swap





-> All Nodes


    sudo swapoff -a

    sudo sed -i '/ swap / s/^/#/' /etc/fstab

    swapon --show







## Set up hostnames

| Master-Node                                | Worker-Node                                |
|--------------------------------------------|--------------------------------------------|
| sudo hostnamectl set-hostname "k8s-master" | sudo hostnamectl set-hostname "k8s-worker" |
| hostname                                   | hostname                                   |
| exec bash                                  | exec bash                                  |

## Step 3: Update the /etc/hosts File for Hostname Resolution


-> All Nodes (IP Address and hostname should be individual on each node)

sudo nano /etc/hosts

#### for master-node
192.168.14.164 k8s-master

# for worker-node
192.168.14.165 k8s-worker

ping -c 4 k8s-master # for master-node
ping -c 4 k8s-worker # for worker-node


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

lsmod | grep overlay



```
output:

overlay               188416  0

```

lsmod | grep br_netfilter



```

output:
br_netfilter           32768  0
bridge                409600  1 br_netfilter

```

sysctl net.bridge.bridge-nf-call-iptables net.bridge.bridge-nf-call-ip6tables net.ipv4.ip_forward

```
output

net.bridge.bridge-nf-call-iptables = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward = 1
```

##  Step 5: Install Docker

- All Nodes
    
    sudo apt update
    sudo apt install docker.io  --yes;
    sudo usermod -aG docker openvpn ;
    sudo systemctl enable docker
    sudo systemctl status docker

## Step 6 : Install Containerd

- All Nodes

    sudo apt-get update

    wget https://github.com/containerd/containerd/releases/download/v1.7.16/containerd-1.7.16-linux-amd64.tar.gz

    sudo tar Cxzvf /usr/local containerd-1.7.16-linux-amd64.tar.gz

    Image : https://www.howtoforge.com/images/how_to_install_containerd_continer_runtime_on_ubuntu_2204/1-download-containerd.png?ezimgfmt=rs:750x271/rscb10/ng:webp/ngcb9


    wget https://github.com/opencontainers/runc/releases/download/v1.1.12/runc.amd64

    sudo install -m 755 runc.amd64 /usr/local/sbin/runc

    which runc


    Image : https://www.howtoforge.com/images/how_to_install_containerd_continer_runtime_on_ubuntu_2204/2-download-runc.png?ezimgfmt=rs:749x203/rscb10/ng:webp/ngcb9


    wget https://github.com/containernetworking/plugins/releases/download/v1.4.1/cni-plugins-linux-amd64-v1.4.1.tgz

    sudo mkdir -p /usr/local/cni/bin

    sudo tar Cxzvf /usr/local/cni/bin cni-plugins-linux-amd64-v1.4.1.tgz
    
    Image : https://www.howtoforge.com/images/how_to_install_containerd_continer_runtime_on_ubuntu_2204/3-download-cni-plugin.png?ezimgfmt=rs:750x422/rscb10/ng:webp/ngcb9

    sudo mkdir -p /etc/containerd/

    containerd config default | sudo tee /etc/containerd/config.toml


    Image : https://www.howtoforge.com/images/how_to_install_containerd_continer_runtime_on_ubuntu_2204/4-generate-containerd-configuration.png?ezimgfmt=rs:750x212/rscb10/ng:webp/ngcb9


    sudo sed -i 's/SystemdCgroup \= false/SystemdCgroup \= true/g' /etc/containerd/config.toml


    sudo curl -L https://raw.githubusercontent.com/containerd/containerd/main/containerd.service -o /etc/systemd/system/containerd.service

    sudo systemctl daemon-reload

    sudo systemctl start containerd
    
    sudo systemctl enable containerd


    Image : https://www.howtoforge.com/images/how_to_install_containerd_continer_runtime_on_ubuntu_2204/5-setup-containerd-systemd-service.png?ezimgfmt=rs:750x133/rscb10/ng:webp/ngcb9


    sudo systemctl status containerd


    Image : https://www.howtoforge.com/images/how_to_install_containerd_continer_runtime_on_ubuntu_2204/big/6-check-containerd-service.png


    wget https://github.com/containerd/nerdctl/releases/download/v1.7.6/nerdctl-1.7.6-linux-amd64.tar.gz


    sudo tar Cxzvf /usr/local/bin nerdctl-1.7.6-linux-amd64.tar.gz

    which nerdctl


    Image : https://www.howtoforge.com/images/how_to_install_containerd_continer_runtime_on_ubuntu_2204/7-install-nerdctl.png?ezimgfmt=rs:750x197/rscb10/ng:webp/ngcb9








##  Step 6: Install kubelet, kubeadm, and kubectl on each node

- All Nodes
    
    
    sudo apt-get update 

    sudo apt update


    Image : https://www.cherryservers.com/v3/assets/blog/2023-09-08/08.png


    
    sudo apt install -y apt-transport-https ca-certificates curl gpg gnupg

    Image : https://www.cherryservers.com/v3/assets/blog/2023-09-08/09.png

    

    curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.30/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

    echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.30/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list


    sudo apt update

    
    sudo apt-get install -y kubelet kubeadm kubectl 

    Image : https://phoenixnap.com/kb/wp-content/uploads/2022/11/output-from-sudo-apt-install-kubeadm-kubelet-kubectl-y-kubernetes-installation-update.png



    sudo apt-mark hold kubelet kubeadm kubectl

    Image : https://phoenixnap.com/kb/wp-content/uploads/2022/11/output-from-sudo-apt-mark-hold-kubeadm-kubelet-kubectl-kubernetes-installation-update.png


    kubeadm version

    Image : https://phoenixnap.com/kb/wp-content/uploads/2022/11/output-from-kubeadm-version-kubernetes-installation-update.png



    sudo nano /etc/modules-load.d/containerd.conf



    overlay
    br_netfilter

    Image : https://phoenixnap.com/kb/wp-content/uploads/2022/11/editing-containerd-conf-kubernetes-installation-update.png


    sudo modprobe overlay

sudo modprobe br_netfilter



sudo nano /etc/sysctl.d/kubernetes.conf



net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1


Image : https://phoenixnap.com/kb/wp-content/uploads/2022/11/editing-kubernetes-conf-kubernetes-installation-update.png


sudo nano /etc/default/kubelet

KUBELET_EXTRA_ARGS="--cgroup-driver=cgroupfs"



sudo systemctl daemon-reload && sudo systemctl restart kubelet



sudo nano /etc/docker/daemon.json



{
      "exec-opts": ["native.cgroupdriver=systemd"],
      "log-driver": "json-file",
      "log-opts": {
      "max-size": "100m"
   },

       "storage-driver": "overlay2"
       }


Image : https://phoenixnap.com/kb/wp-content/uploads/2022/11/editing-docker-daemon-json-kubernetes-installation-update.png



    sudo nano /usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf

    Environment="KUBELET_EXTRA_ARGS=--fail-swap-on=false"



    Image : https://phoenixnap.com/kb/wp-content/uploads/2022/11/editing-10-kubeadm-conf-kubernetes-installation-update.png


    #sudo systemctl enable --now kubelet

    #sudo systemctl daemon-reload



##  Step 6: Install Docker

- All Nodes

    sudo apt install docker.io  --yes;
    sudo usermod -aG docker openvpn ;
    sudo systemctl enable docker
    sudo systemctl status docker
    
    sudo mkdir /etc/containerd ;

    sudo sh -c "containerd config default > /etc/containerd/config.toml" ;
    sudo sed -i 's/ SystemdCgroup = false/ SystemdCgroup = true/' /etc/containerd/config.toml ;
    sudo systemctl daemon-reload;
    sudo systemctl restart containerd.service ;
    sudo systemctl restart kubelet.service ;
    sudo systemctl enable containerd.service;
    sudo systemctl enable kubelet.service ;

##  Step 7: Initialize the Kubernetes cluster on the master node



-> Master Node

    sudo kubeadm config images pull

    sudo kubeadm init --pod-network-cidr=10.10.0.0/16


    output : 

    ```


Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

Alternatively, if you are the root user, you can run:

  export KUBECONFIG=/etc/kubernetes/admin.conf

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 192.168.14.164:6443 --token jjy89t.1kut1a2m4gfjlcjj \
        --discovery-token-ca-cert-hash sha256:0fc5f07d7f4f8323973fce026dd79f26deed7df6de0e0cce9c5b52dbab6809ab

    ```


## Step 8: Configure kubectl and Calico

-> Master Node


    

    kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.27.2/manifests/tigera-operator.yaml
    

    sudo chmod -R 777 /etc/kubernetes/*

curl https://raw.githubusercontent.com/projectcalico/calico/v3.27.2/manifests/custom-resources.yaml -O


    


    sed -i 's/cidr: 192\.168\.0\.0\/16/cidr: 10.10.0.0\/16/g' custom-resources.yaml

    kubectl create -f custom-resources.yaml

##  Step 9: Add worker nodes to the cluster

-> Worker Node

(run as root user)
kubeadm join 192.168.14.164:6443 --token jjy89t.1kut1a2m4gfjlcjj \
        --discovery-token-ca-cert-hash sha256:0fc5f07d7f4f8323973fce026dd79f26deed7df6de0e0cce9c5b52dbab6809ab




##  Step 10: Verify the cluster and test


-> Master Node

    kubectl get no

    kubectl get po -A



## Configure Kubernetes Dashboard





ref : https://adamtheautomator.com/kubernetes-dashboard/

https://dev.to/perber/how-to-create-a-secret-for-a-service-account-in-kubernetes-124-and-above-5c92

https://stackoverflow.com/questions/52322840/how-to-delete-a-service-account-in-kubernetes

https://192.168.14.164:32716/#/deployment?namespace=default


**Step 1**

kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.2.0/aio/deploy/recommended.yaml

**Step 2**

-> verify all of the resources were installed successfully

    kubectl get all -n kubernetes-dashboard



**Step 3**

==>> Setting up the Kubernetes Dashboard

    kubectl edit service/kubernetes-dashboard -n kubernetes-dashboard


kubectl get svc --all-namespaces




kubectl delete pod kubernetes-dashboard-78f87ddfc-sk79j  -n kubernetes-dashboard

-   Remove a service account


    kubectl delete serviceaccount dashboard -n kubernetes-dashboard





-   Get Token

    


    kubectl create clusterrolebinding dashboard-admin -n kubernetes-dashboard  --clusterrole=cluster-admin  --serviceaccount=default:dashboard

    kubectl create sa dashboard
    kubectl create token dashboard --duration=999999h



    eyJhbGciOiJSUzI1NiIsImtpZCI6Im9NVzZibU0xanEzdjJPZnRTb2RwOEctTV9HNmtuMTVXeTBLQmRmekNEWFEifQ.eyJhdWQiOlsiaHR0cHM6Ly9rdWJlcm5ldGVzLmRlZmF1bHQuc3ZjLmNsdXN0ZXIubG9jYWwiXSwiZXhwIjo1MzExNzY4NjYwLCJpYXQiOjE3MTE3NzIyNjAsImlzcyI6Imh0dHBzOi8va3ViZXJuZXRlcy5kZWZhdWx0LnN2Yy5jbHVzdGVyLmxvY2FsIiwia3ViZXJuZXRlcy5pbyI6eyJuYW1lc3BhY2UiOiJkZWZhdWx0Iiwic2VydmljZWFjY291bnQiOnsibmFtZSI6ImRhc2hib2FyZCIsInVpZCI6IjkwZjNlMmM5LWU1NjYtNGQ5NS04ZmM2LTQ4OGFhZWMwN2I1ZiJ9fSwibmJmIjoxNzExNzcyMjYwLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6ZGVmYXVsdDpkYXNoYm9hcmQifQ.RC_KnXUVB92Fe6PYOyNP-2L0okBDTSpcWRFQs4UicNkUCb605sK4uLdFFuStZTkS3Uh81GrNm-bbHhjBE3pG18Q6TOqKRBpGe3doKXOc8a40ldmk6iRCzOlm6stCuSIz7vsdhLVV0kQcfp9l_KQDPy1JGpMYPw6oSXkKrTZdrKYBRpzKY6D9hwGHHdnAeXvJHfXJo2vpFQJC_NqUjTz3VFn6MdHHSaGhRzALiudCrVimlnqZpBGlZWUR3A7j8NWVQKI0mfhmfI3W2WKYe2iiXAhC9uuLJ5uskVZKAB-ugS9RVLG7GKMXGS9tYqiWfsXooeoQ3rBYjzn1fZHx4aoLEQ






    https://192.168.14.164:32716/#/deployment?namespace=default


#### (In-case of reboot)

sudo kubeadm reset

--------------


#### Kubernetes Commands


kubectl get pods -n kube-system

kubectl get nodes

#### Deploy test application on cluster (master node)

kubectl run nginx --image=nginx
