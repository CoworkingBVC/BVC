class PropertyManager {
  constructor(properties) {
    this.properties = properties;
  }

  searchWorkspaces(propertySearchOptions, workspaceSearchOptions) {
    console.log("PM");
    console.log("propertySearchOptions", propertySearchOptions);
    console.log("workspaceSearchOptions", workspaceSearchOptions);
    const results = [];

    for (const property of this.properties) {
      console.log("property: ", property);

      if (this._dataMatchesOptions(property, propertySearchOptions)) {
        for (const workspace of property.workspace) {
          if (this._dataMatchesOptions(workspace, workspaceSearchOptions)) {
            results.push({
              propertyId: property.propertyId,
              workspace: workspace,
            });
          }
        }
      }
    }

    return results;
  }

  _dataMatchesOptions(data, searchOptions) {
    console.log("data option checking");
    let IsMatched = true;
    for (const option in searchOptions) {
      let dataValue = data[option];
      let optionValue = searchOptions[option];

      console.log("option: ", option);
      console.log(dataValue, optionValue);
      switch (option) {
        case "squareFeet":
        case "price":
          console.log("S,P");
          IsMatched =
            IsMatched &&
            this._rangeCheck(dataValue, optionValue[0], optionValue[1]);
          break;
        default:
          console.log("default");
          IsMatched = IsMatched && this._valueCheck(dataValue, optionValue);
      }

      if (!IsMatched) {
        return false;
      }
    }
    return IsMatched;
  }

  /*   _propertyMatchesOptions(property, searchOptions) {
    console.log("property option checking");
    for (const option in searchOptions) {
      let propertyValue = property[option];
      let optionValue = searchOptions[option];
      console.log(propertyValue, optionValue);
      switch (option) {
        case "squreFeet":
          return this._rangeCheck(propertyValue, optionValue);
        default:
          return this._valueCheck(
            propertyValue,
            optionValue[0],
            optionValue[1]
          );
      }
    }
  }

  _workspaceMatchesOptions(workspace, searchOptions) {
    for (const option in searchOptions) {
      let workspaceValue = workspace[option];
      let optionValue = searchOptions[option];
      console.log("option: ", option);
      console.log("workspaceValue: ", workspaceValue);
      console.log("optionValue: ", optionValue);
      switch (option) {
        case "price":
          return this._rangeCheck(workspaceValue, optionValue);
        default:
          return this._valueCheck(
            workspaceValue,
            optionValue[0],
            optionValue[1]
          );
      }
    }
  } */

  _valueCheck(propertyValue, optionValue) {
    let result = propertyValue === optionValue;
    console.log(result);
    return result;
  }

  _rangeCheck(propertyValue, min, max) {
    let result = propertyValue >= min && propertyValue <= max;
    console.log(result);
    return result;
  }
}

module.exports = PropertyManager;
