class PropertyManager {
  constructor(properties) {
    this.properties = properties;
  }

  searchWorkspaces(propertySearchOptions, workspaceSearchOptions) {
    console.log("propertySearchOptions", propertySearchOptions);
    console.log("workspaceSearchOptions", workspaceSearchOptions);
    const results = [];

    for (const property of this.properties) {
      if (this._dataMatchesOptions(property, propertySearchOptions)) {
        for (const workspace of property.workspace) {
          if (this._dataMatchesOptions(workspace, workspaceSearchOptions)) {
            let worksapceWithPropertyInfo = {
              propertyId: property.propertyId,
              address: property.address,
              neighborhood: property.neighborhood,
              squareFeet: property.squareFeet,
              hasParking: property.hasParking,
              hasPublicTransit: property.hasPublicTransit,
              type: workspace.type,
              seats: workspace.seats,
              isSmokingAllowed: workspace.isSmokingAllowed,
              availabilityStart: workspace.availabilityStart,
              availabilityEnd: workspace.availabilityEnd,
              leaseTerm: workspace.leaseTerm,
              price: workspace.price,
            };
            results.push(worksapceWithPropertyInfo);
          }
        }
      }
    }

    return results;
  }

  _dataMatchesOptions(data, searchOptions) {
    let IsMatched = true;
    for (const option in searchOptions) {
      let dataValue = data[option];
      let optionValue = searchOptions[option];

      switch (option) {
        case "squareFeet":
        case "price":
          IsMatched =
            IsMatched &&
            this._rangeCheck(dataValue, optionValue[0], optionValue[1]);
          break;
        case "availabilityStart":
          let startDate = new Date(dataValue);
          IsMatched =
            IsMatched &&
            !isNaN(startDate.getTime()) &&
            new Date(optionValue) >= startDate;
          break;
        case "availabilityEnd":
          let endDate = new Date(dataValue);
          IsMatched =
            IsMatched &&
            !isNaN(endDate.getTime()) &&
            new Date(optionValue) <= endDate;
          break;

        default:
          IsMatched = IsMatched && this._valueCheck(dataValue, optionValue);
      }

      if (!IsMatched) {
        return false;
      }
    }
    return IsMatched;
  }

  _valueCheck(propertyValue, optionValue) {
    let result = propertyValue === optionValue || optionValue == "";

    return result;
  }

  _rangeCheck(propertyValue, min, max) {
    let result = propertyValue >= min && propertyValue <= max;

    return result;
  }
}

module.exports = PropertyManager;
