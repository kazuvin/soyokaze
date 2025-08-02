import "@typespec/openapi";
import "@typespec/http";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@service(#{
    title: "猫API",
})
@doc("PoC of TypeSpec document")
@info({
    version: "1.0.0",
})
@server("http://localhost:8080", "Dev")
namespace CatsAPI;

model SuccessResponse<T extends string> {
    @statusCode _: 200;
    message: T;
}

model ErrorResponse<T extends numeric, U extends string> {
    @statusCode _: T;
    message: U;
}

alias InternalErrorResponse = ErrorResponse<500, "内部エラーが発生しました">;

@doc("年齢")
@minValue(1)
@maxValue(40)
scalar CatAge extends numeric;

// OpenAPIドキュメントにバリデーションとして出力される定数
enum CatTypeEnum {
    @doc("この定数コメントは出力時に失われます")
    MIX: "ミックス",
    SCOTTISH_FOLD: "スコティッシュフォールド",
    MUNCHKIN: "マンチカン",
}

model RegisterCatRequest {
    @doc("お名前")
    @example("マロン")
    name: string;
    @doc("猫種")
    @example(CatTypeEnum.SCOTTISH_FOLD)
    type: CatTypeEnum;
    @doc("年齢")
    @example(10)
    age: CatAge;
}
alias RegisterCatResponse = SuccessResponse<"登録成功">;
alias RegisterCatErrorResponse = ErrorResponse<400, "登録エラーが発生しました"> | InternalErrorResponse;

@tag("cats")
interface Cats {
    @route("/cats/new")
    @post
    @summary("猫情報をAPIに登録する")
    @doc("猫情報をデータベースに登録し、登録結果を返します")
    addCatInfo(@body body: RegisterCatRequest): RegisterCatResponse | RegisterCatErrorResponse
}
