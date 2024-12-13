This repo is an MVP of our Final Year Project, this is basically a scaled down version of our FYP which is made to understand the flow of the project after which it will be scaled to a complete application, aiming to achieve the following through this MVP.

1. Train BiGRU model to effectively translate sentences in English to PSL ( Pakistani Sign Language )
2. To create the backend using django/flask to take input from the frontend in the form of text
3. That sentence is converted into PSL using the weights learned from training the model
4. Reducing the sentence to each wor
5. Creating a database that contains sign language interpretation of 5 sentences which can be fed to the SIGML Player
6. Integrate the SIGML with the backend
7. The sentence reduced to words is passed on to the database and matching words and their hamnosys ( sign language interpretation ) is retreived and is passed on to the SIGML Player
8. The SIGML Player performs the sign language on the user interface.
