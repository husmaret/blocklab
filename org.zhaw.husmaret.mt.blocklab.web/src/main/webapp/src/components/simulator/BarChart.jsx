import { ResponsiveBar } from '@nivo/bar'
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

const BarChart = ({ data }) => {
    
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    var keys = [];
    // transform state to chart data
    let chartData = data.participants.map((participant) => {
		let tmp = {address: participant.name}
        if(participant.balances){
            participant.balances.map(balance => {
            	tmp = {...tmp, [balance.token]: balance.value}
                if (!keys.includes(balance.token)) {
                    keys.push(balance.token);
                }
                return tmp;
            })
        }
        return tmp;
    })

    const chartTheme = {
        "background": "transparent",
        "text": {
            "fontSize": 14,
            "fill": colors.accent[500],
            "outlineWidth": 0,
            "outlineColor": "transparent"
        },
        "axis": {
            "domain": {
                "line": {
                    "stroke": colors.grey[100],
                    "strokeWidth": 1
                }
            },
            "legend": {
                "text": {
                    "fontSize": 14,
                    "fill": colors.accent[500],
                    "outlineWidth": 0,
                    "outlineColor": "transparent"
                }
            },
            "ticks": {
                "line": {
                    "stroke": colors.grey[100],
                    "strokeWidth": 1
                },
                "text": {
                    "fontSize": 14,
                    "fill": colors.accent[500],
                    "outlineWidth": 0,
                    "outlineColor": "transparent"
                }
            }
        },
        "grid": {
            "line": {
                "stroke": "#dddddd",
                "strokeWidth": 1
            }
        },
        "legends": {
            "title": {
                "text": {
                    "fontSize": 14,
                    "fill": colors.accent[500],
                    "outlineWidth": 0,
                    "outlineColor": "transparent"
                }
            },
            "text": {
                "fontSize": 14,
                "fill": colors.accent[500],
                "outlineWidth": 0,
                "outlineColor": "transparent"
            },
            "ticks": {
                "line": {},
                "text": {
                    "fontSize": 14,
                    "fill": colors.accent[500],
                    "outlineWidth": 0,
                    "outlineColor": "transparent"
                }
            }
        },
        "tooltip": {
            "container": {
                "background": colors.primary[500],
                "fontSize": 14
            },
            "basic": {},
            "chip": {},
            "table": {},
            "tableCell": {},
            "tableCellValue": {}
        }
    }

    return (
      <ResponsiveBar
        data={chartData}
        keys={keys}
        indexBy="address"
        margin={{ top: 50, right: 50, bottom: 80, left: 50 }}
        padding={0.3}
        innerPadding={5}
        groupMode="grouped"
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'nivo' }}
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    1.6
                ]
            ]
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
        }}
        labelFormat= {d => <tspan y={ 0 }>{ d }</tspan>}
        labelSkipWidth={14}
        labelSkipHeight={14}
        legends={[
            {
                dataFrom: 'keys',
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 60,
                itemsSpacing: 10,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
        theme={chartTheme}
        role="application"
        ariaLabel="account balances in smart contract"
        barAriaLabel={e=>e.id+": "+e.formattedValue+" for participant: "+e.indexValue}
        layout={'vertical'}
        animate={true}
        // motionConfig={{
        //     mass: 1,
        //     tension: 170,
        //     friction: 26,
        //     clamp: false,
        //     precision: 0.01,
        //     velocity: 0
        // }}
        />
        )
}

export default BarChart;