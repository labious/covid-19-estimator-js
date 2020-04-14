const data = {
  region: {
    name: 'Africa',
    avgAge: 19.7,
    avgDailyIncomeInUSD: 4,
    avgDailyIncomePopulation: 0.73
  },
  periodType: 'days',
  timeToElapse: 38,
  reportedCases: 2747,
  population: 92931687,
  totalHospitalBeds: 678874
};

const requestedTime = data.timeToElapse;
const bedsAvailableForCovid = 0.35 * data.totalHospitalBeds;
const impactFactor = 10;
const severeImpactFactor = 50;
const hospitilisedCases = 0.15;
const IcuRequired = 0.05;
const ventilatorRecquired = 0.02;
const weekDays = 7;
const monthDays = 30;
const daysToDouble = 3;
const workingPopulation = data.region.avgDailyIncomePopulation;
const dollarEarning = data.region.avgDailyIncomeInUSD;
const periodX = data.periodType;

const factor = (time, periodType) => {
  let returnValue;
  switch (periodType) {
    case 'months': returnValue = Math.trunc((time * monthDays) / daysToDouble); break;
    case 'weeks': returnValue = Math.trunc((time * weekDays) / daysToDouble); break;
    default: returnValue = Math.trunc(time / 3);
  }
  return returnValue;
};
const powerComputation = 2 ** factor(requestedTime, periodX);
const impactcodeCleaner = data.reportedCases * impactFactor * powerComputation;
const severeImpactCodeCleaner = data.reportedCases * severeImpactFactor * powerComputation;
const dollarCalc = workingPopulation * dollarEarning;

const impact = {
  currentlyInfected: data.reportedCases * impactFactor,
  infectionsByRequestedTime: impactcodeCleaner,
  severeCasesByRequestedTime: Math.trunc(impactcodeCleaner * hospitilisedCases),
  hospitalBedsByRequestedTime: Math.trunc(bedsAvailableForCovid
      - impactcodeCleaner * hospitilisedCases),
  casesForICUByRequestedTime: Math.trunc(impactcodeCleaner * IcuRequired),
  casesForVentilatorsByRequestedTime: Math.trunc(impactcodeCleaner * ventilatorRecquired),
  dollarsInFlight: Math.trunc(dollarCalc * impactcodeCleaner * requestedTime)
};

const severeImpact = {
  currentlyInfected: data.reportedCases * severeImpactFactor,
  infectionsByRequestedTime: severeImpactCodeCleaner,
  severeCasesByRequestedTime: Math.trunc(severeImpactCodeCleaner * hospitilisedCases),
  hospitalBedsByRequestedTime: Math.trunc(bedsAvailableForCovid
      - severeImpactCodeCleaner * hospitilisedCases),
  casesForICUByRequestedTime: Math.trunc(severeImpactCodeCleaner * IcuRequired),
  casesForVentilatorsByRequestedTime: Math.trunc(severeImpactCodeCleaner * ventilatorRecquired),
  dollarsInFlight: Math.trunc(dollarCalc * severeImpactCodeCleaner * requestedTime)
};

const covid19ImpactEstimator = (data) => {
  const output = {
    data,
    impact,
    severeImpact
  };
  return output;
};
export default covid19ImpactEstimator;
