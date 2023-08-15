class PropertyManager {
  constructor(properties) {
    this.properties = properties;
  }

  searchWorkspaces(searchOptions) {
    const results = [];

    for (const property of this.properties) {
      console.log("property: ", property);
      for (const workspace of property.workspace) {
        let matched = true;
        console.log("workspace: ", workspace);
        for (const option in searchOptions) {
          console.log("option: ", option);
          if (option in workspace) {
            if (workspace[option] !== searchOptions[option]) {
              console.log("workspace[option]: ", workspace[option]);
              console.log("searchOptions[option]: ", searchOptions[option]);
              matched = false;
              break;
            }
          } else {
            matched = false;
            break;
          }
        }

        if (matched) {
          results.push({
            propertyId: property.propertyId,
            workspace: workspace,
          });
        }
      }
    }

    return results;
  }
}

module.exports = PropertyManager;
