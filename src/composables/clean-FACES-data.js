/**
 * Clean the raw FACES resource repository data. Expects the general structure of the data contained in [Master List Repository](https://docs.google.com/spreadsheets/d/1NuGjSo7xwBRtCx_kCpoT2eb9BmEEkjkr/edit?usp=sharing&ouid=103668074026507033128&rtpof=true&sd=true).
 * 
 * @param {string: any} rawData An object containing the structured raw data to be cleaned
 * @returns {{cleanData: {}, uniqueAgeGroups: string[], uniqueServices: string[]}} An object containing the cleaned data and a list of the unique age groups and a list of the unique services contained in the cleaned data
 */
export function cleanRawFACESData(rawData) {
  // Empty array to contain the primary unique services (services in dataset with specific header value (i.e., not included under "Other..."))
  let uniqueServices = []

  // Add an id key and an array of services to each entry in the dataset
  const cleanData = rawData.map((resource, i) => {
    // Add id parameter to each resource object and an empty array to hold a list of services from the data
    let cleanResource = {
      id: i,
      services: []
    }

    Object.entries(resource).forEach(d => {
      // Add each column name and row value to the clean resource object
      cleanResource[d[0]] = d[1]

      // If the parameter value of the resource is a string and the value is "yes", add the parameter name (i.e., the service name) to the list of services
      if (
        typeof(d[1]) === 'string' 
        && d[1].toLowerCase() === 'yes'
      ) {
        // NOTE: split is to remove " (Yes or No)" text from first service parameter name
        const serviceName = d[0].split(' (Yes or No)')[0]
        cleanResource.services.push(serviceName)

        // Build the unique services array
        if (!uniqueServices.includes(serviceName)) {
          uniqueServices.push(serviceName)
        }
      }
    })

    // Some resource have additional services, add those to services array if so
    const additionalServices = cleanResource['Other (List the other services)']
    if (additionalServices) {
      cleanResource.services = cleanResource.services.concat(additionalServices.split(', '))
    }

    return cleanResource
  })

  // Sort clean data by resource name
  cleanData.sort((a, b) => {
    let nameA = a.Name.toLowerCase()
    let nameB = b.Name.toLowerCase()
    if (nameA > nameB) {
      return 1
    }
    if (nameA < nameB) {
      return -1
    }
    return 0
  })

  const uniqueAgeGroups = [
    'Infants (0-1 year)',
    'Toddlers (1-3 years)',
    'Preschoolers (3-5 years)',
    'Children (5-12 years)',
    'Adolescents (12-18 years)',
    'Young Adults (18-21 years)',
    'Adults (21+ years)'
  ]

  return {
    cleanData,
    uniqueAgeGroups,
    uniqueServices
  }
}