import React, { useEffect, useState } from 'react';
import './App.css';
import BarChart from './charts/BarChart';
import Form from 'react-bootstrap/Form';
import { Flipside, Query, QueryResultSet } from "@flipsidecrypto/sdk";

const API_KEY = `${process.env.REACT_APP_API_KEY}`;

const getQuery = (collection: string) => {
	const query: Query = {
	  sql: `
	  SELECT s.block_timestamp::date AS date
	  , SUM(s.sales_amount) AS volume
	  FROM solana.core.fact_nft_sales s
	  JOIN solana.core.dim_nft_metadata m ON m.mint = s.mint AND m.project_name = '${collection}'
	  WHERE s.block_timestamp::date < CURRENT_DATE::date
	  AND s.block_timestamp::date >= CURRENT_DATE - 30
	  GROUP BY 1
	  ORDER BY 1
	  `,
	  ttlMinutes: 10,
	};
	return(query);
}


function App() {
    const [data, setData] = useState([]);

	const handleSelectOption = (e: any) => {
		console.log(`updateCollection to ${e.target.value}`);
		console.log(e);
		runSDKApi(e.target.value);
	}

	const runSDKApi = async (mint: string) => {
		const flipside = new Flipside(
			API_KEY,
			"https://node-api.flipsidecrypto.com"
		);
		const query = getQuery(mint);
		console.log(query);
		const start = new Date().getTime();
		const result = await flipside.query.run(query);
		const end = new Date().getTime();
		console.log(`Took ${Math.round((end - start)) / 1000} seconds to run the query`);

		if(result.rows?.length) {
			// @ts-ignore
			setData(result.rows);
		} else {
			setData([]);
		}
	}


    return (
        <div className="App">
            <h2>Daily $SOL Volume</h2>
			<div>
				<Form.Select onChange={handleSelectOption} aria-label="Default select example">
					<option>Select a Collection</option>
					<option value="Solana Monkey Business">Solana Monkey Business</option>
					<option value="Primates">Primates</option>
					<option value="Okay Bears">Okay Bears</option>
				</Form.Select>
			</div>
            <BarChart id='bar-chart' width={1000} height={600} data={data} />
        </div>
    );
}

export default App;