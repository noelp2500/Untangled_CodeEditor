export const defaultCodeSnippet = () => {
  return `
  
"""
* Welcome to Noel's Untangled Code Editor/Playground! *

Embark on a journey of excellence with our refined coding environment, boasting these distinguished features:

## Get prompted AI Help
To get prompted AI Help, Input your prompt between --> <-- and write your code below it, and experience tailored 
AI guidance by clicking "Get AI Help."

## Get unpromted AI Help
Compose your script, click "Get AI Help," button and you're good to go

## Check memory and time
Just press "Compile and Execute" after writing your code, to analyze memory and execution time.

"""

def pyramid_of_yikes(levels):
    for i in range(1, levels + 1):
        spaces = ' ' * (levels - i)
        laughter = '*' * (2 * i - 1)
        print(spaces + laughter)

sing_words = ["Noel", "NoelDaGreat", "NoelDaDope"]
weird_song = ' '.join(f"I love {word}!" for word in sing_words)
print(weird_song)

pyramid_of_yikes(5)

`;
};
