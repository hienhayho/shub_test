package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

type Query struct {
	Type  string `json:"type"`
	Range []int  `json:"range"`
}

type ApiResponse struct {
	Token string  `json:"token"`
	Data  []int   `json:"data"`
	Query []Query `json:"query"`
}

func getData(url string) (*ApiResponse, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to fetch data: %s", resp.Status)
	}

	var apiResponse ApiResponse
	if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
		return nil, err
	}

	return &apiResponse, nil
}

func main() {
	url := "https://test-share.shub.edu.vn/api/intern-test/input"

	apiResponse, err := getData(url)
	if err != nil {
		fmt.Println(err)
		return
	}

	data := apiResponse.Data
	token := apiResponse.Token

	oddPrefixSum := make([]int, len(data)+1)
	oddPrefixSum[0] = 0
	evenPrefixSum := make([]int, len(data)+1)
	evenPrefixSum[0] = 0

	for i := 1; i <= len(data); i++ {
		if i%2 == 0 {
			evenPrefixSum[i] = evenPrefixSum[i-1] + data[i-1]
			oddPrefixSum[i] = oddPrefixSum[i-1]
		} else {
			oddPrefixSum[i] = oddPrefixSum[i-1] + data[i-1]
			evenPrefixSum[i] = evenPrefixSum[i-1]
		}
	}

	// fmt.Println(evenPrefixSum)
	// fmt.Println(oddPrefixSum)

	result := make([]int, 0)

	queries := apiResponse.Query

	for _, query := range queries {

		if query.Range[0] < 1 || query.Range[1] > len(data) || query.Range[0] > query.Range[1] {
			fmt.Println("Invalid range")
			continue
		}

		l := query.Range[0]
		r := query.Range[1]

		if query.Type == "1" {
			total := evenPrefixSum[r] - evenPrefixSum[l-1] + oddPrefixSum[r] - oddPrefixSum[l-1]
			result = append(result, total)
		} else if query.Type == "2" {
			sumEven := evenPrefixSum[r] - evenPrefixSum[l-1]
			sumOdd := oddPrefixSum[r] - oddPrefixSum[l-1]
			result = append(result, sumEven-sumOdd)
		}
	}

	// fmt.Println(result)
	json_data, err := json.Marshal(result)

	if err != nil {
		fmt.Println(err)
		return
	}
	url = "https://test-share.shub.edu.vn/api/intern-test/output"

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(json_data))

	if err != nil {
		fmt.Println(err)
		return
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", `Bearer `+token)

	client := &http.Client{}
	resp, err := client.Do(req)

	if err != nil {
		fmt.Println(err)
		return
	}

	defer resp.Body.Close()

	fmt.Println("Response Status:", resp.Status)
}
