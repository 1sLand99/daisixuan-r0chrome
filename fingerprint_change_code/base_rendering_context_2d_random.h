#include <iostream>
#include<cstring>
#include<string>
#include<vector>
#include<algorithm>
#include<time.h>
#include<stdio.h>
#include<stdlib.h>

int get_random_num(){
    srand(int(time(0)));
    return rand() % 20;
}