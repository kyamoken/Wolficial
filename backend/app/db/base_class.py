from sqlalchemy.ext.declarative import as_declarative, declared_attr

@as_declarative()
class Base:
    id: any
    __name__: str

    # 自動で __tablename__ を小文字クラス名 plural に
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower() + "s"