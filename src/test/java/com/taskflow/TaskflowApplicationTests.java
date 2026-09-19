package com.taskflow;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.taskflow.repository.TaskRepository;

@SpringBootTest
@AutoConfigureMockMvc
class TaskflowApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private TaskRepository taskRepository;

	@BeforeEach
	void cleanTasks() {
		taskRepository.deleteAll();
	}

	@Test
	void contextLoads() {
	}

	@Test
	void taskLifecycleCanBeManagedThroughTheApi() throws Exception {
		String createResponse = mockMvc.perform(post("/tasks")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"title\":\"Write tests\",\"description\":\"Cover the API\"}"))
			.andExpect(status().isCreated())
			.andExpect(header().string("Location", org.hamcrest.Matchers.matchesPattern("/tasks/[0-9]+")))
			.andExpect(jsonPath("$.id").isNumber())
			.andExpect(jsonPath("$.title").value("Write tests"))
			.andReturn().getResponse().getContentAsString();

				Number idValue = JsonPath.read(createResponse, "$.id");
				long id = idValue.longValue();

		mockMvc.perform(get("/tasks/{id}", id))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.description").value("Cover the API"));

		mockMvc.perform(put("/tasks/{id}", id)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"title\":\"Write better tests\",\"description\":\"Cover CRUD\"}"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.title").value("Write better tests"));

		mockMvc.perform(delete("/tasks/{id}", id))
			.andExpect(status().isNoContent());

		mockMvc.perform(get("/tasks/{id}", id))
			.andExpect(status().isNotFound());
	}

	@Test
	void listReturnsEmptyArrayWhenNoTasksExist() throws Exception {
		mockMvc.perform(get("/tasks"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$", hasSize(0)));
	}

	@Test
	void blankTitleIsRejectedWithFieldDetails() throws Exception {
		mockMvc.perform(post("/tasks")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"title\":\"  \"}"))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.message").value("Request validation failed"))
			.andExpect(jsonPath("$.fieldErrors.title").value("title must not be blank"));
	}

	@Test
	void missingTaskReturnsUsefulNotFoundError() throws Exception {
		mockMvc.perform(get("/tasks/999999"))
			.andExpect(status().isNotFound())
			.andExpect(jsonPath("$.message").value("Task with id 999999 was not found"));
	}

}
