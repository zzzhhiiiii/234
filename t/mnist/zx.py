import torch
from torchvision import datasets, transforms
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torchsummary import summary
from model import Net
from tqdm import tqdm

train_transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.1307, ), (0.3081, )),  # Common used parameters for mnist normalization.
])
test_transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.1307, ), (0.3081, )),
])

# Read dataset and apply preprocessing.
train_dataset = datasets.MNIST(
    "data",                        # The path to store data
    train=True,                    # True to get training set, false to get validation set.
    download=True,                 
    transform=train_transform      # Apply data preprocessing defined.
)
test_dataset = datasets.MNIST(
    "data",
    train=False,
    transform=test_transform
)

# Prepare data to be ready for training.
train_dataloader = torch.utils.data.DataLoader(
    dataset=train_dataset,
    batch_size=32,
    shuffle=True
)
test_dataloader = torch.utils.data.DataLoader(
    dataset=test_dataset,
    batch_size=32,
    shuffle=True
)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = Net().to(device)
optimizer = optim.Adam(model.parameters())

summary(model, (1, 28, 28))


#train model

model.train()
best_acc = 0.

for epoch in range(10):

    train_loss = 0
    correct = 0
    print(f'Epoch: {epoch}')
    tepoch = tqdm(train_dataloader, total=int(len(train_dataloader)))
    for data, target in tepoch:
        data, target = data.to(device), target.to(device)
        optimizer.zero_grad()

        # Feed forward
        output = model(data)

        # Accuracy
        pred = output.argmax(dim=1, keepdim=True)
        correct += pred.eq(target.view_as(pred)).sum().item()

        # Loss
        loss = F.cross_entropy(output, target)
        loss.backward()

        # Step optimizer
        optimizer.step()

        tepoch.set_postfix(loss=loss.item())

    train_acc = correct / len(train_dataloader.dataset)
    train_loss = loss.item()

    print('Train Epoch: {} \t Loss: {:.4f} Accuracy: {:.4f}'.format(
        str(epoch+1), train_loss, train_acc))

    #model to onnx    
    model.eval()
    dummy_input = torch.zeros((1, 1, 28, 28))
    torch.onnx.export(model, dummy_input,
                    'onnx_model.onnx', verbose=True)

torch.save(model.state_dict(), "model.pt")