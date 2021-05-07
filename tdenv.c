#include <stdio.h>
#include <stdlib.h>
#include"k.h"
#ifdef __cplusplus
extern "C"{
#endif

K add(K x,K y)
{
  if(x->t!=-KJ||y->t!=-KJ)
    return krr("type");
  return kj(x->j+y->j);
}

K client_id(K s) {
  return kp(getenv("CLIENT_ID"));
}

#ifdef __cplusplus
}
#endif
