#### Header

```

import { Header } from '@nestjs/common';



@Post()
@Header('Cache-Control', 'none')
create() {
  return 'This action adds a new cat';
}

```


#### Rediection

```



@Get()
@Redirect('https://nestjs.com', 301)

```


#### Route parameters#


```

import { Param  } from '@nestjs/common';

@Get(':id')
findOne(@Param() params: any): string {
  console.log(params.id);
  return `This action returns a #${params.id} cat`;
}

```

#### sub-domain-routing

https://docs.nestjs.com/controllers#sub-domain-routing

