import "@typespec/http";

using TypeSpec.Http;

namespace SoyokazeAPI;

// Common response types
model ErrorResponse {
  error: string;
  message: string;
  statusCode: int32;
}

model SuccessResponse {
  message: string;
  statusCode: int32;
}

// Pagination types
model PaginationParams {
  @query page?: int32 = 1;
  @query limit?: int32 = 10;
}

model PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: int32;
    limit: int32;
    total: int32;
    totalPages: int32;
  };
}

// Common validation patterns
@format("email")
scalar Email extends string;

@minLength(6)
@maxLength(100)
scalar Password extends string;

@minLength(2)
@maxLength(50)
scalar Name extends string;

@maxLength(500)
scalar Bio extends string;

@maxLength(100)
scalar Location extends string;

@format("uri")
scalar Url extends string;