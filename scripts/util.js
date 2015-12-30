import moment from "moment";

export function getWeeks({ start = moment().startOf('isoweek'), weeks = 4 } = {}) {
    let returnWeeks = [];

    for(var i = 0 - weeks; i <= weeks; i++) {
        returnWeeks.push(moment(start).add(i, 'week'));
    }

    return returnWeeks;
}
