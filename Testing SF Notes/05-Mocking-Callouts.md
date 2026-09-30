# 05 — Mocking Callouts

---

## Why You Need Mocks

Salesforce **does not allow real HTTP callouts** from test methods. If your code calls an external API, the test will throw a `System.CalloutException`.

You must create a **fake response** using a mock class.

---

## `HttpCalloutMock` — Mocking REST Callouts

### Step 1: Create the Mock Class
```apex
@isTest
global class MockHttpResponse implements HttpCalloutMock {

    global HTTPResponse respond(HTTPRequest req) {
        HttpResponse res = new HttpResponse();
        res.setHeader('Content-Type', 'application/json');
        res.setBody('{"status":"success","count":42}');
        res.setStatusCode(200);
        return res;
    }
}
```

### Step 2: Use `Test.setMock()` in the Test
```apex
@isTest
private class ExternalServiceTest {
    @isTest
    static void testCallout() {
        // Tell the test to use our mock
        Test.setMock(HttpCalloutMock.class, new MockHttpResponse());

        Test.startTest();
            String result = ExternalService.fetchData();  // This method does an Http callout
        Test.stopTest();

        System.assertEquals('success', result);
    }
}
```

### Key Rules
| Rule | Detail |
|---|---|
| `Test.setMock()` must be called BEFORE the callout | Otherwise the test will fail |
| The mock class must implement `HttpCalloutMock` | And must be annotated with `@isTest` or be `global` |
| The `respond()` method receives the actual request | You can inspect the request URL, headers, body |
| One mock per test method | Each `setMock` replaces the previous one |

---

## `WebServiceMock` — Mocking SOAP Callouts

For SOAP web services (generated from WSDL), you implement `WebServiceMock` instead.

```apex
@isTest
global class MockWebService implements WebServiceMock {

    global void doInvoke(
        Object stub,
        Object request,
        Map<String, Object> response,
        String endpoint,
        String soapAction,
        String requestName,
        String responseNS,
        String responseName,
        String responseType
    ) {
        // Create the response object that matches the WSDL-generated class
        MyWebService.GetStatusResponse_element respElement =
            new MyWebService.GetStatusResponse_element();
        respElement.status = 'Active';

        response.put('response_x', respElement);
    }
}
```

### Using the SOAP Mock
```apex
@isTest
static void testSoapCallout() {
    Test.setMock(WebServiceMock.class, new MockWebService());

    Test.startTest();
        String status = MyWebService.getStatus('12345');
    Test.stopTest();

    System.assertEquals('Active', status);
}
```

---

## `StaticResourceCalloutMock` — Quick Mock Without a Class

If you just need a simple JSON/XML response, use a Static Resource instead of writing a mock class.

### Step 1: Upload JSON as a Static Resource named `MockResponse`
```json
{"status":"success","count":42}
```

### Step 2: Use it in the test
```apex
@isTest
static void testWithStaticResource() {
    StaticResourceCalloutMock mock = new StaticResourceCalloutMock();
    mock.setStaticResource('MockResponse');
    mock.setStatusCode(200);
    mock.setHeader('Content-Type', 'application/json');

    Test.setMock(HttpCalloutMock.class, mock);

    Test.startTest();
        String result = ExternalService.fetchData();
    Test.stopTest();

    System.assertEquals('success', result);
}
```

---

## Conditional Mock (Inspecting the Request)

You can return different responses based on the request URL or method.

```apex
@isTest
global class MultiEndpointMock implements HttpCalloutMock {

    global HTTPResponse respond(HTTPRequest req) {
        HttpResponse res = new HttpResponse();
        res.setHeader('Content-Type', 'application/json');

        if (req.getEndpoint().contains('/accounts')) {
            res.setBody('{"type":"account"}');
            res.setStatusCode(200);
        } else if (req.getEndpoint().contains('/contacts')) {
            res.setBody('{"type":"contact"}');
            res.setStatusCode(200);
        } else {
            res.setBody('{"error":"not found"}');
            res.setStatusCode(404);
        }

        return res;
    }
}
```

---

## Quick-Fire Cards

**Q: What happens if you make a real HTTP callout in a test method?**
> A: You get a `System.CalloutException`. Callouts are blocked in test context.

**Q: What interface do you implement for REST callout mocks?**
> A: `HttpCalloutMock`

**Q: What interface do you implement for SOAP callout mocks?**
> A: `WebServiceMock`

**Q: What method registers the mock before the callout?**
> A: `Test.setMock(HttpCalloutMock.class, new MyMock())`

**Q: Can you use a Static Resource as a mock response body?**
> A: Yes, using `StaticResourceCalloutMock`.
