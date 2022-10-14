if __name__ == "__main__":
    # User input
    user_input = input()

    # Specify an answer.
    answer ="apple"

    # Compare user input and answer.
    for i in range(len(user_input)):
        if user_input[i] == answer[i]:
            print("A")
        elif user_input[i] in answer:
            print("B")
        else:
            print("X")

                