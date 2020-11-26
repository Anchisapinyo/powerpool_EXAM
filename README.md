POWERPOOL_local-Network -DAPP

Private blockchain Ethereum web application (Local network: Ganache)

Dependencies

Install these prerequisites to as follow:
 
NPM: https://nodejs.org

Truffle: https://github.com/trufflesuite/truffle

Ganache: http://truffleframework.com/ganache/

Metamask: https://metamask.io/


Step 1. Clone the project

git clone https://github.com/Anchisapinyo/POWERPOOL_local-Network

Step 2. Install dependencies

$ cd POWERPOOL_local-Network

$ npm install

Step 3. Start Ganache

Open the Ganache GUI client that you downloaded and installed.

This will start your local blockchain instance. 

Step 4. Compile & Deploy Smart Contract

$ truffle migrate --reset 

You must migrate the smart contract each time your restart ganache.

Step 5. Configure Metamask

Connect metamask to your local Etherum blockchain provided by Ganache.

Import an account provided by ganache.

Step 6. Run the Front End Application

$ npm run dev 

Visit this URL in your browser: http://localhost:3005

