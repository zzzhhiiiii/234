from tqdm import tqdm

model.train()
best_acc = 0.

for epoch in range(20):
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
    
		# Put validate function here.

torch.save(model.state_dict(), "model.pt")