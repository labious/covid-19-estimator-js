const bedsAvailableForCovid = 0.35 * data.totalHospitalBeds;
const impactFactor = 10;
const severeImpactFactor = 50;
const hospitilisedCases = 0.15;
const IcuRequired = 0.05;
const ventilatorRecquired = 0.02;
const weekDays = 7;
const monthDays = 30;
const daysToDouble = 3;

const factor = (time, periodType) => {
  let returnValue;
  switch (periodType) {
    case 'months': returnValue = Math.trunc((time * monthDays) / daysToDouble); break;
    case 'weeks': returnValue = Math.trunc((time * weekDays) / daysToDouble); break;
    default: returnValue = Math.trunc(time / 3);
  }
  return returnValue;
};

const powerComputation = 2 ** factor(data.timeToElapse, data.periodType);
const impactcodeCleaner = data.reportedCases * impactFactor * powerComputation;
const severeImpactCodeCleaner = data.reportedCases * severeImpactFactor * powerComputation;
const dollarCalc = data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD;

const impact = {
  currentlyInfected: data.reportedCases * impactFactor,
  infectionsByRequestedTime: impactcodeCleaner,
  severeCasesByRequestedTime: Math.trunc(impactcodeCleaner * hospitilisedCases),
  hospitalBedsByRequestedTime: Math.trunc(bedsAvailableForCovid
      - impactcodeCleaner * hospitilisedCases),
  casesForICUByRequestedTime: Math.trunc(impactcodeCleaner * IcuRequired),
  casesForVentilatorsByRequestedTime: Math.trunc(impactcodeCleaner * ventilatorRecquired),
  dollarsInFlight: Math.trunc(dollarCalc * impactcodeCleaner * data.timeToElapse)
};

const severeImpact = {
  currentlyInfected: data.reportedCases * severeImpactFactor,
  infectionsByRequestedTime: severeImpactCodeCleaner,
  severeCasesByRequestedTime: Math.trunc(severeImpactCodeCleaner * hospitilisedCases),
  hospitalBedsByRequestedTime: Math.trunc(bedsAvailableForCovid
      - severeImpactCodeCleaner * hospitilisedCases),
  casesForICUByRequestedTime: Math.trunc(severeImpactCodeCleaner * IcuRequired),
  casesForVentilatorsByRequestedTime: Math.trunc(severeImpactCodeCleaner * ventilatorRecquired),
  dollarsInFlight: Math.trunc(dollarCalc * severeImpactCodeCleaner * data.timeToElapse)
};

const covid19ImpactEstimator = (dataInput) => {
  const input = dataInput;
  return {
    input,
    impact,
    severeImpact
  };
};
export default covid19ImpactEstimator;