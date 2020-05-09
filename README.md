# API Users

<p>Restful API to menage users</p>

<table>
    <tr>
        <th>HTTP methods</th>
        <th>URI path</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>POST</td>
        <td>/api/user</td>
        <td>Register user</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/api/user/auth</td>
        <td>User authenticate and retrieve token</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/api/user</td>
        <td>Retrieve user on JSON format
        </td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/api/users</td>
        <td>Retrieve all users on JSON format</td>
    </tr>
    <tr>
        <td>PATCH</td>
        <td>/api/user</td>
        <td>Update user fields</td>
    </tr>
    <tr>
        <td>PATCH</td>
        <td>/api/user/password</td>
        <td>Update user password</td>
    </tr>
    <tr>
        <td>DELETE</td>
        <td>/api/user/delete</td>
        <td>Delete user</td>
    </tr>
</table>

## JSON response format

```json
{
  "id": "5eb6525aeb6f612b84d6e674",
  "name": "user",
  "surname": "userName",
  "username": "theUser",
  "email": "user@example.com"
}
```
## Default user schema data fields

```js
const UserSchema = new Schema({
    name: {type: String, required: true, trim: true},
    surname: {type: String, required: true, trim: true},
    username: {type: String, required: true, trim: true},
    email: {type: String, required: true, trim: true},
    password: {type: String, required: true, trim: true},
    createdAt: {type: Date, required: true, default: Date.now()},
    authenticatedAt: {type: Date},
    deactivated: {type: Boolean, default: false}
})
```

## Technologies used in the project

<ul>
    <li>Node Js</li>
    <li>Express Js</li>
    <li>MongoDB</li>
    <li>Mongoose</li>
    <li>JSON Web Token</li>
    <li>Bcrypt</li>
    <li>Testing:</li>
    <ul>
        <li>Mocha</li>
        <li>Chai</li>
    </ul>
</ul>