MNIST model Training
========================
* Train the model to be deployed in web page.
* Convert the model to onnx format.


Install
-------------------------
* 新建環境
```````````````````````````````````
conda create -n pytorch python=3.8.3
```````````````````````````````````
* 進入環境
````````````````````````````````````
conda activate pytorh
`````````````````````````````````````
* 安裝pytorch
````````````````````````````````````
conda install pytorch==1.8.0 torchvision==0.9.0 cpuonly -c pytorch
````````````````````````````````````
* 安裝其他套件
`````````````````````````````````````
pip install torchsummary PyYAML tqdm 
`````````````````````````````````````

Train Model
-------------------------
> zx.py

Define Model
-------------------------
> model.py
