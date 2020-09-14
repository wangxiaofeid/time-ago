import moment from 'moment';

const STRINGS = {
    year: '年',
    month: '月',
    day: '天',
    hour: '小时',
    minute: '分钟',
    second: '秒',
};
const defaultConfig = { typeMap: STRINGS, step: 2 };
export default function timeAgo(startTime, endTime, config) {
    const _confg = config || defaultConfig;
    let startMoment = null,
        endMoment = null;
    if (!startTime) {
        return null;
    } else {
        startMoment = moment(startTime);
    }
    if (endTime) {
        endMoment = moment(endTime);
    } else {
        endMoment = moment();
    }
    if (!startMoment.isValid() || !endMoment.isValid()) {
        return null;
    }
    if (startMoment.isAfter(endMoment)) {
        const _moment = startMoment;
        startMoment = endMoment;
        endMoment = _moment;
    }

    let yDiff = endMoment.year() - startMoment.year();
    let mDiff = endMoment.month() - startMoment.month();
    let dDiff = endMoment.date() - startMoment.date();
    let hourDiff = endMoment.hour() - startMoment.hour();
    let minDiff = endMoment.minute() - startMoment.minute();
    let secDiff = endMoment.second() - startMoment.second();

    if (secDiff < 0) {
        secDiff = 60 + secDiff;
        minDiff--;
    }
    if (minDiff < 0) {
        minDiff = 60 + minDiff;
        hourDiff--;
    }
    if (hourDiff < 0) {
        hourDiff = 24 + hourDiff;
        dDiff--;
    }
    if (dDiff < 0) {
        var daysInLastFullMonth = moment(
            endMoment.year() + '-' + (endMoment.month() + 1),
            'YYYY-MM'
        )
            .subtract(1, 'M')
            .daysInMonth();
        if (daysInLastFullMonth < startMoment.date()) {
            dDiff = daysInLastFullMonth + dDiff + (startMoment.date() - daysInLastFullMonth);
        } else {
            dDiff = daysInLastFullMonth + dDiff;
        }
        mDiff--;
    }
    if (mDiff < 0) {
        mDiff = 12 + mDiff;
        yDiff--;
    }

    return buildStringFromValues(
        {
            yDiff,
            mDiff,
            dDiff,
            hourDiff,
            minDiff,
            secDiff,
        },
        _confg
    );
}

function buildStringFromValues(
    { yDiff, mDiff, dDiff, hourDiff, minDiff, secDiff },
    { typeMap, step, isData = false }
) {
    if (isData) {
        return {
            yDiff,
            mDiff,
            dDiff,
            hourDiff,
            minDiff,
            secDiff,
        };
    }
    let result = [];
    if (yDiff) {
        result.push(`${yDiff}${typeMap.year}`);
    }
    if (mDiff) {
        result.push(`${mDiff}${typeMap.month}`);
    }
    if (dDiff) {
        result.push(`${dDiff}${typeMap.day}`);
    }
    if (hourDiff) {
        result.push(`${hourDiff}${typeMap.hour}`);
    }
    if (minDiff) {
        result.push(`${minDiff}${typeMap.minute}`);
    }
    if (secDiff) {
        result.push(`${secDiff}${typeMap.second}`);
    }
    if (step) {
        result = result.slice(0, step);
    }
    return result.join('');
}
