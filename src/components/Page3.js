import React, {useContext, useState} from 'react';
import Chart from 'react-google-charts';
import Component from 'react-component-component';
import UserContext from '../user-context';

function get_object_date(objectId) {
    return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
}

function Page3() {

    const {user} = useContext(UserContext)

    return (
        <Component
        initialState={{ dataLoadingStatus: 'loading', chartData: [] }}
        didMount={async function(component) {
            const COUNTRY_CODE = 'lb'
            const INDICATOR = 'DT.DOD.DECT.CD'
            const response = await fetch(
                'http://192.168.0.210:3004/load_result',
                {
                    method: 'POST',
                    headers: {'Content-Type': 'Application/json'},
                    body: JSON.stringify(user),
                }
            )
            const json = await response.json()
            const data = json
            {
                console.log(data)
            }
            const columns = [
                { type: 'date', label: 'Date' },
                { type: 'number', label: 'Speed' },
                { type: 'number', label: 'Error' },
            ]
            let rows = []
            const nonNullData = data.filter(row => row.value !== null)
            for (let row of nonNullData) {
                const { _id, speed, error_count } = row
                rows.push([get_object_date(_id.$oid), speed, error_count])
            }
            component.setState({
                chartData: [columns, ...rows],
                dataLoadingStatus: 'ready',
            })
        }}
        >
        {component => {
            return component.state.dataLoadingStatus === 'ready' ? (
                <Chart
                chartType="LineChart"
                data={component.state.chartData}
                options={{
                    hAxis: {
                        format: 'dd MMMM',
                    },
                    vAxis: {
                        format: 'short',
                    },
                    title: 'Скорость набора и ошибки',
                    series: {
                        0: { curveType: 'function' },
                        1: { curveType: 'function' },
                    }
                }}
                rootProps={{ 'data-testid': '2' }}
                />
            ) : (
                <div>Fetching data from API</div>
            )
        }}
        </Component>
    )
}

export default Page3;
