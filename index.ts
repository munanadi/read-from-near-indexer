import { Pool, Client, Connection } from 'pg';

const pool = new Pool({
  host: 'mainnet.db.explorer.indexer.near.dev',
  user: 'public_readonly',
  password: 'nearprotocol',
  database: 'mainnet_explorer',
});

main()
  .then((_) => {})
  .catch((e) => console.log(e))
  .finally(() => pool.end());

async function main() {
  await pool.connect();

  const result = await pool.query(
    `select transaction_hash as tx_hash from transactions A where A.signer_account_id = $1 limit 2 offset 5;`,
    ['spoiler.near']
  );

  // const txnsHashArr = result.rows.map((ele: any) => ele.tx_hash);
  const txnsHashArr = [
    'HFKFKArxKzY3bWRAU7dh2ZkWvyQxXxV2TEeXCU2XLzi',
    'BkGEzbLy1WjzD7FC2ETCZyqS58RJR2Psg5q5UoKYj5Pp',
  ];

  for (const txnHash of txnsHashArr) {
    console.log(`Fethcing for ${txnHash}`);
    const data = await pool.query(
      `select * from transaction_actions TA where TA.transaction_hash = '${txnHash}';`
    );

    const resultObject = data.rows[0];

    // console.log(resultObject);

    const argObject = resultObject['args']['args_json'];

    let msgString: string = argObject['msg'].toString();
    msgString = msgString.split('\\').join('');
    const memo = argObject['memo'];

    console.log(JSON.parse(msgString), memo);
  }

  return;
}
