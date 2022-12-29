MNIST model Training
========================
Train the model and Convert the model to onnx format.


Install
-------------------------
* Create New Environment
```````````````````````````````````
conda create -n <env_name> python=3.8.3
```````````````````````````````````
* Switch Environment
````````````````````````````````````
conda activate <env_name>
`````````````````````````````````````
* Install Pytorch
````````````````````````````````````
conda install pytorch==1.8.0 torchvision==0.9.0 cpuonly -c pytorch
````````````````````````````````````
*  Install Package
`````````````````````````````````````
pip install torchsummary PyYAML tqdm 
`````````````````````````````````````

Define Model
-------------------------
> model.py

Train Model
-------------------------
Train the model and Convert the model to onnx format.
> zx.py

