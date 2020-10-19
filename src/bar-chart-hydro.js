import React from 'react';
import {View, Text} from 'react-native';
import {Svg, Rect, G} from 'react-native-svg';
import AbstractChart from './abstract-chart';

const barWidth = 32;

class BarChartHydro extends AbstractChart {
    getBarPercentage = () => {
        const {barPercentage = 1} = this.props.chartConfig;
        return barPercentage;
    };

    renderBars = config => {
        const {data, width, height, paddingTop, paddingRight, barRadius} = config;
        const output = [];
        data.forEach((dataset, index) => {
            const baseHeight = this.calcBaseHeight(dataset.data, height);
            dataset.data.map((x, i) => {
                const barHeight = this.calcHeight(x, dataset.data, height);
                const barWidth = 8 * this.getBarPercentage();
                output.push(
                    <Rect
                        key={Math.random()}
                        x={
                            (paddingRight +
                                (i * (width - paddingRight)) / dataset.data.length +
                                barWidth / 2) + index *8
                        }
                        y={
                            ((barHeight > 0 ? baseHeight - barHeight : baseHeight) / 4) * 3 +
                            paddingTop
                        }
                        rx={barRadius}
                        width={barWidth}
                        height={(Math.abs(barHeight) / 4) * 3}
                        fill={index==0?"#123DF1":"#89B8FB"}
                    />,
                );
            });
        });
        return output;
    };

    renderBarTops = config => {
        const {data, width, height, paddingTop, paddingRight} = config;
        const baseHeight = this.calcBaseHeight(data, height);
        return data.map((x, i) => {
            const barHeight = this.calcHeight(x, data, height);
            const barWidth = 32 * this.getBarPercentage();
            return (
                <Rect
                    key={Math.random()}
                    x={
                        paddingRight +
                        (i * (width - paddingRight)) / data.length +
                        barWidth / 2
                    }
                    y={((baseHeight - barHeight) / 4) * 3 + paddingTop}
                    width={barWidth}
                    height={2}
                    fill={this.props.chartConfig.color(0.6)}
                />
            );
        });
    };

    render() {
        const {
            width,
            height,
            data,
            style = {},
            withHorizontalLabels = true,
            withVerticalLabels = true,
            verticalLabelRotation = 0,
            horizontalLabelRotation = 0,
            withInnerLines = true,
            showBarTops = true,
            segments = 4,
            yAxisCustomLabel = "",
        } = this.props;
        const {borderRadius = 0, paddingTop = 16, paddingRight = 40} = style;
        const config = {
            width,
            height,
            verticalLabelRotation,
            horizontalLabelRotation,
            barRadius: (this.props.chartConfig && this.props.chartConfig.barRadius) || 0,
            decimalPlaces: (this.props.chartConfig && this.props.chartConfig.decimalPlaces) || 0,
            formatYLabel: (this.props.chartConfig && this.props.chartConfig.formatYLabel) || function (label) {
                return label;
            },
            formatXLabel: (this.props.chartConfig && this.props.chartConfig.formatXLabel) || function (label) {
                return label;
            },
        };
        return (
            <View style={style}>
                <Svg height={height} width={width}>
                    <Text style={{textAlign:'left', paddingLeft: paddingRight + 3, paddingTop: 0, fontSize:12, fontFamily: 'Montserrat'}}>{this.props.yAxisCustomLabel}</Text>
                    {this.renderDefs({
                        ...config,
                        ...this.props.chartConfig,
                    })}
                    <Rect
                        width="100%"
                        height={height}
                        rx={borderRadius}
                        ry={borderRadius}
                        fill="url(#backgroundGradient)"
                    />
                    <G>
                        {withInnerLines
                            ? this.renderHorizontalLines({
                                ...config,
                                count: segments,
                                paddingTop,
                                paddingRight: 40,
                            })
                            : null}
                    </G>
                    <G>
                        {withHorizontalLabels
                            ? this.renderHorizontalLabels({
                                ...config,
                                count: segments,
                                data: data.datasets[0].data,
                                paddingTop,
                                paddingRight,
                            })
                            : null}
                    </G>
                    <G>
                        {withVerticalLabels
                            ? this.renderVerticalLabels({
                                ...config,
                                labels: data.labels,
                                paddingRight,
                                paddingTop,
                                horizontalOffset: barWidth - 20 * this.getBarPercentage(),
                            })
                            : null}
                    </G>
                    <G>
                        {this.renderBars({
                            ...config,
                            data: data.datasets,
                            paddingTop,
                            paddingRight,
                        })}
                    </G>
                    <G>
                        {showBarTops && this.renderBarTops({
                            ...config,
                            data: data.datasets[0].data,
                            paddingTop,
                            paddingRight,
                        })}
                    </G>
                </Svg>
            </View>
        );
    }
}

export default BarChartHydro;
