import { IsEmail, IsNotEmpty, Matches } from "class-validator";
import { MessageEnum } from "src/helpers/message.enum";
import { RegExHelper } from "src/helpers/regex.helper";

// npm i class-validator class-transformer - lib de validador
export class CreateUserDto {
    @IsNotEmpty() // Validador para não ser vázio
    nome: string;

    @IsNotEmpty()
    @IsEmail() // Validador para email
    email: string;
    
    @IsNotEmpty()    
    // @Matches(new RegExp(RegExHelper.senha), { message: MessageEnum.SENHA_VALIDA }) // Regex para definir os padrões da senha
    senha: string;
  
    // @IsNotEmpty()    
    tipo: string;
}