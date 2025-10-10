import os
import asyncio
import sys
from vulcan import Keystore, Account

if sys.platform.startswith('win'):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

async def main():
    os.makedirs("keys", exist_ok=True)

    keystore = await Keystore.create(device_model="Vulcan API")
    account = await Account.register(keystore, 'token', 'symbol', 'pin')

    with open("keys/keystore.json", "w") as f:
        f.write(keystore.as_json)

    with open("keys/account.json", "w") as f:
        f.write(account.as_json)

asyncio.run(main()) 