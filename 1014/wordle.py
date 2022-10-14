import random

if __name__ == "__main__":
    # User input
    user_input = input()

    # Specify an answer.
    f = open("words.txt", "r")
    dictionary = f.read().splitlines()
    f.close()
    answer = random.sample(dictionary, 1)[0]
    print(answer)

    # Compare user input and answer.
    for i in range(len(user_input)):
        if user_input[i] == answer[i]:
            print("A")
        elif user_input[i] in answer:
            print("B")
        else:
            print("X")

                