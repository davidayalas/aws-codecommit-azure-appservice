# AWS Code Commit to Azure AppService

This README explains how to integrate AWS Code Commit with Azure AppService to trigger automatic deploys.

1. [Azure] Create Azure AppService 
1. [AWS] Create your AWS Code Commit Repo
1. [AWS] Create an IAM User to hold the SSH Keys for Azure AppService (Kudu) access to repo
1. [Azure] Retrieve the public key of your AppService

	https://{appservice}.scm.azurewebsites.net/api/sshkey?ensurePublicKey=1

1. [AWS] Put the key in the Security Credentials of IAM User

	http://docs.aws.amazon.com/codecommit/latest/userguide/setting-up-ssh-unixes.html

1. [Azure] Edit the ~/.ssh/config with Kudu (https://{your appservice}.scm.azurewebsites.net/DebugConsole) and assign the "SSH key ID"


		Host git-codecommit.*.amazonaws.com
		  User {SSH Key Id}
		  IdentityFile ~/.ssh/{your private key file}

1. [AWS] Create a Lambda Function [index.js](index.js)

	Once the function is working, you can download the max execution time to 1s because de depoy is launched.

1. [AWS] Assign permissions to Code Commit to execute Lambda

	http://docs.aws.amazon.com/codecommit/latest/userguide/how-to-notify-lambda-cc.html

		policy.json 

		{
			"FunctionName": "trigger_ci_azure_paas", 
			"StatementId": "1", 
			"Action": "lambda:InvokeFunction", 
			"Principal": "codecommit.amazonaws.com", 
			"SourceArn": "arn:aws:codecommit:eu-west-1:XXXXXXX:*", 
			"SourceAccount": "XXXXXXX"
		}


		$ aws lambda add-permission --cli-input-json file://policy.json

1. [AWS] Create trigger a Code Commit

	- customData = (user and password from Azure AppService publish profile) = https://{user}:{password}@{site}.scm.azurewebsites.net/deploy
	- Trigger name = repository name
	- Last step function name

1. [Azure] Setup deployment options
	
	- External repository
	- Select the ssh version of the repo from AWS Code Commit





