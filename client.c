#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
void main(int argc, char* argv[]) {
	char* ip;
	char* email;
	int port;
	if(argc < 4) {
		printf("Not enough paramters entered");
	}
	email = argv[1];
	port = atoi(argv[2]);
	ip = argv[3];
	int s = socket(AF_INET, SOCK_STREAM, 0);
	struct sockaddr_in serv_addr;
//	memset(&serv_addr, '0', sizeof(serv_addr));
	serv_addr.sin_family = AF_INET;
	serv_addr.sin_port = htons(port);
	inet_pton(AF_INET, ip, &serv_addr.sin_addr);
	int c = connect(s, (struct sockaddr*)&serv_addr, sizeof(serv_addr));
	if(c == -1) {
//		return -1;
		exit(-1);
	}
	char buffer[255];
	sprintf(buffer, "cs230 HELLO %s\n", email);
	send(s, buffer, strlen(buffer), 0);
	recv(s, buffer, 255, 0);
	puts(buffer);
	int num1 = 0;
	int num2 = 0;
	while(1 == 1) {
		if(strncmp(buffer, "cs230 STATUS", 12) != 0) {
//			puts("ERROR");
			puts(buffer);
			break;
		}
		num1 = 0;
		num2 = 0;
		int flagNum1 = 0;
		int operation = 0;
		for(int i = 13; i < 23; i++) {
			if(buffer[i] >= 48 && buffer[i] <= 57) {
				if(flagNum1 == 0) {
					num1 = num1 * 10 + (buffer[i] - 48);
					
				} else {
					num2 = num2 * 10 + (buffer[i] - 48);
				}
			}
			if(buffer[i] == 42 || buffer[i] == 43 || buffer[i] == 45 || buffer[i] == 47) {
				flagNum1 = 1;
				operation = buffer[i];
			}
			if(buffer[i] == 10) {
				break;
			}
		}	
		int result = 0;
		if(operation == 42) {
			result = num1 * num2;
		}
		if(operation == 43) {
			result = num1 + num2;
		}
		if(operation == 45) {
			result = num1 - num2;
		}
		if(operation == 47) {
			result = num1 / num2;
		}
		sprintf(buffer,"cs230 %i\n", result);
//		puts(buffer);
		send(s, buffer, strlen(buffer), 0);
		for(int i = 0; i < strlen(buffer); i++) {
			buffer[i] = 0;
		}
		recv(s, buffer, 255, 0);
//		puts(buffer);

	}
}

