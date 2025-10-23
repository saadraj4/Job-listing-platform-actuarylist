const API_BASE_URL = 'http://localhost:5000/api';

export async function fetchJobs(params) {
  const queryParams = new URLSearchParams();

  if (params?.keyword) queryParams.append('keyword', params.keyword);
  if (params?.job_type && params.job_type !== 'All') queryParams.append('job_type', params.job_type);
  if (params?.location && params.location !== 'All') queryParams.append('location', params.location);
  if (params?.tags && params.tags.length > 0) {
    params.tags.forEach(tag => queryParams.append('tag', tag));
  }
  if (params?.sort) queryParams.append('sort', params.sort);

  const url = `${API_BASE_URL}/getAllJobs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch jobs: ${response.statusText}`);
  }

  return response.json();
}

export async function createJob(jobData) {
  const response = await fetch(`${API_BASE_URL}/createJob`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...jobData,
      tags: jobData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'Failed to create job');
  }

  return response.json();
}

export async function updateJob(id, jobData) {
  const response = await fetch(`${API_BASE_URL}/updateJob/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...jobData,
      tags: jobData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'Failed to update job');
  }

  return response.json();
}

export async function deleteJob(id) {
  const response = await fetch(`${API_BASE_URL}/removeJob/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete job: ${response.statusText}`);
  }
}
