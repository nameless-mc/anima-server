# api document

## サインオン API

```
POST /api/signon
```

| param | type   | description |
| ----- | ------ | ----------- |
| pref  | string | 都道府県    |

```javascript
{
    "pref": string
}
```

### レスポンス

#### 成功時

200 OK

## twitter 認証

```
GET /auth/twitter
```

### レスポンス

#### 成功時

twitter にリダイレクト
