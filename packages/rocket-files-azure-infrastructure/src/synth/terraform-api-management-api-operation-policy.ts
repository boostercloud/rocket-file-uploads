import { RocketUtils, templates } from '@boostercloud/framework-provider-azure-infrastructure'
import { ApiManagementApiOperation, ApiManagementApiOperationPolicy } from '@cdktf/provider-azurerm'
import { TerraformStack } from 'cdktf'
import * as Mustache from 'mustache'

export class TerraformApiManagementApiOperationPolicy {
  static build(
    utils: RocketUtils,
    appPrefix: string,
    functionAppName: string,
    terraformStack: TerraformStack,
    apiManagementApiOperation: ApiManagementApiOperation,
    resourceGroupName: string,
    endpoint: string
  ): ApiManagementApiOperationPolicy {
    const idApiManagementApiOperationPolicy = utils.toTerraformName(appPrefix, `amaopr${endpoint}`)
    const policyContent = Mustache.render(templates.policy, { functionAppName: functionAppName })
    return new ApiManagementApiOperationPolicy(terraformStack, idApiManagementApiOperationPolicy, {
      apiName: apiManagementApiOperation.apiName,
      apiManagementName: apiManagementApiOperation.apiManagementName,
      resourceGroupName: resourceGroupName,
      operationId: apiManagementApiOperation.operationId,
      xmlContent: policyContent,
    })
  }
}
