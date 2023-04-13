console.log("Hello from background script");

const openai_api_key = "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";

async function chatGPTRequest(prompt) {
  console.log("chatGPTRequest");
  const request = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openai_api_key}`,
    },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content: `you are a content creator for a software engineering writing a blog. 
            The reader is a software engineer who is interested in using the openai api.
            The reader is familiar with javascript and has some experience with the openai api.
            The response should be formatted in double-quoted property name in JSON only and escaped, no explanation is needed.
           {
              "field": "sting",
              "label": "sting",
              "value": "string",
           }`,
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 2000,
      temperature: 0.9,
      model: "gpt-3.5-turbo",
    }),
  });

  const data = await request.json();
  console.log("chatGPTRequest", data.choices[0].message.content);
  return JSON.parse(data.choices[0].message.content);
}

async function suggestValues(formFieldsInfo) {
  const suggestions = [];
  console.log(formFieldsInfo);
  for (const fieldInfo of formFieldsInfo) {
    const prompt = `Suggest a value for a ${fieldInfo.type} field with name ${fieldInfo.name} and label ${fieldInfo.label}`;
    const suggestion = await chatGPTRequest(prompt);
    suggestions.push(suggestion);
  }

  return suggestions;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.formFieldsInfo) {
    suggestValues(request.formFieldsInfo).then((suggestions) => {
      sendResponse({ suggestions });
    });
    return true; // Keep the message channel open for async response
  }
});
