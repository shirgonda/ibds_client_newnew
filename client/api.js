const baseURL='https://proj.ruppin.ac.il/cgroup57/test2/tar1';
export async function Get(url){
        let res=await fetch(`${baseURL}/${url}`,{
            method:'GET',
        });
    if(res.status===404){
        return false;
      }
    return await res.json(); 
}

export async function Post(url, data,picture) {
    data.profilePicture = picture;
        let res = await fetch(`${baseURL}/${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if(res.status===400 || res.status===500){
          return false;
        }
        return await res.json();
}

export async function PostOneValue(url, data) {
      let res = await fetch(`${baseURL}/${url}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      });
      if(res.status===400 || res.status===500){
        return false;
      }
      return await res.json();
}

export async function PostCalendarItem(url, data) {
    try {
        let res = await fetch(`${baseURL}/${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return await res.json();
    }
    catch (error) {
        return error;
    }
}

export async function Put(url, data) {
        let res = await fetch(`${baseURL}/${url}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if(res.status===404){
            return false;
          }
        return await res.json();
}

export async function Delete(url, data) {
        const response = await fetch(`${baseURL}/${url}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if(response.status===404||response.status===500||response.status===400){
            return false;
        }
        return true;
}

export async function LogIn(url, userEmail, userPassword) {
      let res = await fetch(`${baseURL}/${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userEmail, userPassword)
      });
      if(res.status===404 || res.status===403){
        return false;
      }
      return await res.json();
}

export async function QueryChatGPT(url, rights) {
    try {
      let res = await fetch(`${baseURL}/${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(rights)
      });
      if(res.status===500){
        return false;
      }
      let rawResponse= await res.text();
      return rawResponse;
    } catch (error) {
      return error;
    }
}

