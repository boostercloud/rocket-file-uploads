import { ApplicationSynthStack, RocketUtils } from '@boostercloud/framework-provider-azure-infrastructure'
import { ApiManagementApi, ApiManagementApiOperation } from '@cdktf/provider-azurerm'
import { TerraformStack } from 'cdktf'
import { rootEndpoint } from '@boostercloud/rocket-files-types'

export class TerraformApiManagementApiOperation {
  static build(
    terraformStack: TerraformStack,
    applicationSynthStack: ApplicationSynthStack,
    utils: RocketUtils,
    appPrefix: string,
    resourceGroupName: string,
    endpoint: string
  ): ApiManagementApiOperation {
    const apiManagementApi = applicationSynthStack.apiManagementApi as ApiManagementApi
    const idApiManagementApiOperation = utils.toTerraformName(appPrefix, `amaor${endpoint}`)

    return new ApiManagementApiOperation(terraformStack, idApiManagementApiOperation, {
      operationId: `${endpoint}POST`,
      apiName: apiManagementApi?.name,
      apiManagementName: apiManagementApi?.apiManagementName,
      resourceGroupName: resourceGroupName,
      displayName: `/${rootEndpoint}/${endpoint}`,
      method: 'POST',
      urlTemplate: `/${rootEndpoint}/${endpoint}`,
      description: '',
      response: [
        {
          statusCode: 200,
        },
      ],
    })
  }
}
